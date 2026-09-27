import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import type {
  ConsumeResponse,
  PurchaseResult,
  PurchasesResponse,
  SDKLiteInstance,
  UserStateRecord,
} from "@/lib/sdklite-types"

const mocks = vi.hoisted(() => ({
  sdk: null as SDKLiteInstance | null,
}))

vi.mock("@/contexts/pi-auth-context", () => ({
  usePiAuth: () => ({ sdk: mocks.sdk }),
}))

import { useAds, usePurchase, useUserState } from "@/lib/pi-payment"

// Shared fixtures ----------------------------------------------------------------

const PURCHASE_RESULT: PurchaseResult = {
  ok: true,
  productId: "lab-pack-small",
  paymentId: "pay-123",
  txid: "tx-456",
}

const PURCHASES: PurchasesResponse = {
  purchases: [
    { productId: "lab-pack-small", quantity: 3 },
    { productId: "hint-pack", quantity: 1 },
  ],
}

const RECORD: UserStateRecord = {
  blob: { xp: 10 },
  updatedAt: "2026-01-01T00:00:00.000Z",
  version: 1,
}

function makeSdk() {
  const sdk = {
    login: vi.fn(() => Promise.resolve(true)),
    makePurchase: vi.fn(() => Promise.resolve(PURCHASE_RESULT)),
    showInterstitial: vi.fn(() => Promise.resolve(true)),
    showRewarded: vi.fn(() => Promise.resolve(true)),
    isAdNetworkSupported: vi.fn(() => Promise.resolve(true)),
    state: {
      get: vi.fn(() => Promise.resolve(RECORD)),
      set: vi.fn(() => Promise.resolve()),
      products: vi.fn(() => Promise.resolve({ products: [] })),
      purchases: vi.fn(() => Promise.resolve(PURCHASES)),
      consume: vi.fn((productId: string, quantity?: number) =>
        Promise.resolve<ConsumeResponse>({ productId, quantity: quantity ?? 1 }),
      ),
      restore: vi.fn(() => Promise.resolve(PURCHASES)),
    },
  }
  return sdk
}

describe("usePurchase", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.sdk = null
  })

  it("delegates to the SDK and resolves with the purchase result", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => usePurchase())

    await expect(result.current.makePurchase("lab-pack-small")).resolves.toEqual(
      PURCHASE_RESULT,
    )
    expect(sdk.makePurchase).toHaveBeenCalledTimes(1)
    expect(sdk.makePurchase).toHaveBeenCalledWith("lab-pack-small")
  })

  it("throws when the SDK is not initialized", async () => {
    const { result } = renderHook(() => usePurchase())

    await expect(result.current.makePurchase("lab-pack-small")).rejects.toThrow(
      "SDK not initialized",
    )
  })

  it("propagates SDK purchase failures (e.g. cancelled payment)", async () => {
    const sdk = makeSdk()
    sdk.makePurchase = vi.fn(() => Promise.reject(new Error("purchase_cancelled")))
    mocks.sdk = sdk
    const { result } = renderHook(() => usePurchase())

    await expect(result.current.makePurchase("lab-pack-small")).rejects.toThrow(
      "purchase_cancelled",
    )
  })
})

describe("useAds", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.sdk = null
  })

  it("reports ad network support through the SDK", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useAds())

    await expect(result.current.isAdNetworkSupported()).resolves.toBe(true)
    expect(sdk.isAdNetworkSupported).toHaveBeenCalledTimes(1)
  })

  it("shows an interstitial and returns its result", async () => {
    const sdk = makeSdk()
    sdk.showInterstitial = vi.fn(() => Promise.resolve(false))
    mocks.sdk = sdk
    const { result } = renderHook(() => useAds())

    await expect(result.current.showInterstitial()).resolves.toBe(false)
    expect(sdk.showInterstitial).toHaveBeenCalledTimes(1)
  })

  it("shows a rewarded ad for the given product", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useAds())

    await expect(result.current.showRewarded("hint-pack")).resolves.toBe(true)
    expect(sdk.showRewarded).toHaveBeenCalledWith("hint-pack")
  })

  it("returns false for every ad call when the SDK is not initialized", async () => {
    const { result } = renderHook(() => useAds())

    await expect(result.current.isAdNetworkSupported()).resolves.toBe(false)
    await expect(result.current.showInterstitial()).resolves.toBe(false)
    await expect(result.current.showRewarded("hint-pack")).resolves.toBe(false)
  })
})

describe("useUserState", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.sdk = null
  })

  it("gets a state record by key", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useUserState())

    await expect(result.current.get("arduinolab.progress")).resolves.toEqual(RECORD)
    expect(sdk.state.get).toHaveBeenCalledWith("arduinolab.progress")
  })

  it("sets a state blob through the SDK", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useUserState())

    await result.current.set("arduinolab.progress", { xp: 42 })
    expect(sdk.state.set).toHaveBeenCalledWith("arduinolab.progress", { xp: 42 })
  })

  it("lists purchases", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useUserState())

    await expect(result.current.purchases()).resolves.toEqual(PURCHASES)
    expect(sdk.state.purchases).toHaveBeenCalledTimes(1)
  })

  it("consumes a product and echoes the remaining quantity", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useUserState())

    await expect(
      result.current.consume("lab-pack-small", 2),
    ).resolves.toEqual({ productId: "lab-pack-small", quantity: 2 })
    expect(sdk.state.consume).toHaveBeenCalledWith("lab-pack-small", 2)
  })

  it("restores purchases with optional options", async () => {
    const sdk = makeSdk()
    mocks.sdk = sdk
    const { result } = renderHook(() => useUserState())

    await expect(result.current.restore({ keys: ["lab-pack-small"] })).resolves.toEqual(
      PURCHASES,
    )
    expect(sdk.state.restore).toHaveBeenCalledWith({ keys: ["lab-pack-small"] })
  })

  it("throws for every state call when the SDK is not initialized", async () => {
    const { result } = renderHook(() => useUserState())

    await expect(result.current.get("k")).rejects.toThrow("SDK not initialized")
    await expect(result.current.set("k", {})).rejects.toThrow("SDK not initialized")
    await expect(result.current.purchases()).rejects.toThrow("SDK not initialized")
    await expect(result.current.consume("p")).rejects.toThrow("SDK not initialized")
    await expect(result.current.restore()).rejects.toThrow("SDK not initialized")
  })
})
