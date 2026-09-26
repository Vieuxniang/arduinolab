"use client"

import { useMemo, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { PRODUCT_CONFIG } from "@/lib/product-config"
import type { SDKLiteError } from "@/lib/sdklite-types"

export function ArduinoPayButton() {
  const auth = usePiAuth()
  const products = auth?.products
  const sdk = auth?.sdk
  const restoredPurchases = auth?.restoredPurchases as
    | { purchases?: Array<{ productId: string; quantity: number }> }
    | Array<{ productId: string; quantity: number }>
    | null
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const product = products?.find(
    (p) => p.id === PRODUCT_CONFIG.PRODUCT_6a872b9d40b01ffe8a3efe89,
  )
  const amount = product?.price_in_pi
  const quantity = useMemo(() => {
    const purchases = Array.isArray(restoredPurchases)
      ? restoredPurchases
      : restoredPurchases?.purchases ?? []
    return purchases.find((p) => p.productId === product?.slug)?.quantity ?? 0
  }, [product?.slug, restoredPurchases])

  const handlePurchase = async () => {
    if (!product) {
      setError("ArduinoLab pay is currently unavailable.")
      return
    }
    if (!sdk) {
      setError("Pi payment is still initializing.")
      return
    }

    setBusy(true)
    setMessage("")
    setError("")
    try {
      const result = await sdk.makePurchase(product.slug)
      if (result.ok) {
        setMessage(`Payment confirmed · ${result.paymentId}`)
      }
    } catch (caught) {
      const paymentError = caught as Partial<SDKLiteError>
      setError(
        paymentError.code === "purchase_cancelled"
          ? "Payment cancelled."
          : paymentError.code === "product_not_found"
            ? "This product could not be found."
            : "Payment failed. Please try again.",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-background/60 p-2">
      <button
        type="button"
        onClick={handlePurchase}
        disabled={busy || !product}
        className="w-full rounded-md border border-primary/60 bg-primary/10 px-3 py-2.5 text-left text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={product ? `${product.name}, ${amount} Pi` : "ArduinoLab pay unavailable"}
      >
        <span className="flex items-center justify-between gap-2">
          <span>{product?.name ?? "ArduinoLab pay"}</span>
          <span>{product ? `${amount?.toFixed(1)} Pi` : "Unavailable"}</span>
        </span>
        {busy && <span className="mt-1 block text-[11px] font-normal">Opening Pi payment…</span>}
      </button>
      {quantity > 0 && <p className="mt-1.5 text-[11px] text-muted-foreground">Restored: {quantity}</p>}
      {message && <p className="mt-1.5 text-[11px] text-primary">{message}</p>}
      {error && <p className="mt-1.5 text-[11px] text-destructive">{error}</p>}
    </div>
  )
}

// Consumable products should call sdk.state.consume(product.slug, 1) after use.
// ArduinoLab pay is left restorable until its product type is confirmed.

export default ArduinoPayButton
