"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

const COMMUNICATION_REQUEST_TYPE = '@pi:app:sdk:communication_information_request';

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (error) {
    // Cross-origin access may throw when in an iframe
    if (
      error instanceof DOMException &&
      (error.name === 'SecurityError' || error.code === DOMException.SECURITY_ERR || error.code === 18)
    ) {
      return true;
    }
    // Firefox may throw generic Permission denied errors
    if (error instanceof Error && /Permission denied/i.test(error.message)) {
      return true;
    }

    throw error;
  }
}

function parseJsonSafely(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

/**
 * Requests authentication credentials from the parent window (App Studio) via postMessage.
 * Returns null if not in iframe, timeout, or missing token (non-fatal check).
 *
 * @returns {Promise<{accessToken: string, appId: string}|null>} Resolves with credentials or null
 */
function requestParentCredentials(): Promise<{ accessToken: string; appId: string | null } | null> {
  // Early return if not in an iframe
  if (!isInIframe()) {
    return Promise.resolve(null);
  }

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const timeoutMs = 1500;

  return new Promise((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Cleanup function to remove listener and clear timeout
    const cleanup = (listener: (event: MessageEvent) => void) => {
      window.removeEventListener('message', listener);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

    const messageListener = (event: MessageEvent) => {
      // Security: only accept messages from parent window
      if (event.source !== window.parent) {
        return;
      }

      // Validate message type and request ID match
      const data = parseJsonSafely(event.data);
      if (!data || data.type !== COMMUNICATION_REQUEST_TYPE || data.id !== requestId) {
        return;
      }

      cleanup(messageListener);

      // Extract credentials from response payload
      const payload = (typeof data.payload === 'object' && data.payload !== null
        ? data.payload
        : {}) as Record<string, unknown>;
      const accessToken = typeof payload.accessToken === 'string' ? payload.accessToken : null;
      const appId = typeof payload.appId === 'string' ? payload.appId : null;

      // Return credentials or null if missing token
      resolve(accessToken ? { accessToken, appId } : null);
    };

    // Set timeout handler (resolve with null on timeout)
    timeoutId = setTimeout(() => {
      cleanup(messageListener);
      resolve(null);
    }, timeoutMs);

    // Register listener before sending request to avoid race condition
    window.addEventListener('message', messageListener);

    // Send request to parent window to get credentials
    window.parent.postMessage(
      JSON.stringify({
        type: COMMUNICATION_REQUEST_TYPE,
        id: requestId
      }),
      '*'
    );
  });
}

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

// Memoized so concurrent calls (StrictMode double-effects, double-tapped
// retry) share one <script> tag instead of injecting duplicates.
let piSDKPromise: Promise<void> | null = null;
let sdkLitePromise: Promise<void> | null = null;

const loadPiSDK = (): Promise<void> => {
  if (piSDKPromise) return piSDKPromise;

  piSDKPromise = new Promise<void>((resolve, reject) => {
    if (typeof window.Pi !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  }).catch((error) => {
    // Allow a later retry to attempt the load again.
    piSDKPromise = null;
    throw error;
  });

  return piSDKPromise;
};

const loadSDKLite = (): Promise<void> => {
  if (sdkLitePromise) return sdkLitePromise;

  sdkLitePromise = new Promise<void>((resolve, reject) => {
    if (typeof window.SDKLite !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_LITE_URL) {
      reject(new Error("SDKLite URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => {
      console.log("SDKLite script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load SDKLite script");
      reject(new Error("Failed to load SDKLite script"));
    };

    document.head.appendChild(script);
  }).catch((error) => {
    // Allow a later retry to attempt the load again.
    sdkLitePromise = null;
    throw error;
  });

  return sdkLitePromise;
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);
  // Deduplicates concurrent initialization runs (double effects, retry spam)
  // so login() and purchase restore only ever run once at a time.
  const initInFlight = useRef<Promise<void> | null>(null);

  const fetchProducts = useCallback(
    async (sdkInstance: SDKLiteInstance): Promise<void> => {
      try {
        const { products } = await sdkInstance.state.products();
        setProducts(products);
      } catch (e) {
        console.error("Failed to load products:", e);
        setProducts([]);
      }
    },
    [],
  );

  const initialize = useCallback(async () => {
    if (initInFlight.current) return initInFlight.current;

    const run = (async () => {
      setHasError(false);
      setRestoredPurchases(null);
      try {
        // Probe for parent credentials (App Studio iframe environment).
        // When running inside App Studio's restore-preview iframe, SDKLite.login()
        // cannot complete outside the Pi CDN wrapper and would hang indefinitely.
        const parentCredentials = await requestParentCredentials();
        if (parentCredentials) {
          setIsAuthenticated(true);
          return;
        }

        setAuthMessage("Loading Pi SDK...");
        await loadPiSDK();
        setAuthMessage("Initializing Pi Network...");
        await window.Pi.init({
          version: "2.0",
          sandbox: PI_NETWORK_CONFIG.SANDBOX,
        });
        setAuthMessage("Loading SDKLite...");
        await loadSDKLite();

        setAuthMessage("Initializing SDKLite...");
        const sdkInstance = await window.SDKLite.init();
        setAuthMessage("Logging in...");
        const success = await sdkInstance.login();
        if (!success) {
          throw new Error("Login failed. Please try again.");
        }

        setSdk(sdkInstance);
        setIsAuthenticated(true);
        await fetchProducts(sdkInstance);

        try {
          const { purchases } = await sdkInstance.state.restore();
          setRestoredPurchases(purchases);
          console.log("[PiAuth] Purchases restored", purchases);
        } catch (e) {
          console.error("[PiAuth] Failed to restore purchases:", e);
          setRestoredPurchases([]);
        }
      } catch (err) {
        console.error("SDKLite initialization failed:", err);
        setHasError(true);
        setAuthMessage(
          err instanceof Error
            ? err.message
            : "Authentication failed. Please try again.",
        );
      }
    })();

    initInFlight.current = run;
    try {
      await run;
    } finally {
      initInFlight.current = null;
    }
  }, [fetchProducts]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    hasError,
    sdk,
    products,
    restoredPurchases,
    reinitialize: initialize,
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
