import { useEffect } from "react"
import { GestureDetector } from "@/lib/lab/gestures"

interface GestureCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDoubleTap?: (x: number, y: number) => void
  onLongPress?: (x: number, y: number) => void
}

export function useGestures(element: HTMLElement | null, callbacks: GestureCallbacks) {
  useEffect(() => {
    if (!element) return

    const detector = new GestureDetector(callbacks)
    detector.attach(element)
  }, [element, callbacks])
}
