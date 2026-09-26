export interface GestureHandler {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDoubleTap?: (x: number, y: number) => void
  onLongPress?: (x: number, y: number) => void
}

export class GestureDetector {
  private startX = 0
  private startY = 0
  private startTime = 0
  private tapCount = 0
  private tapTimeout: NodeJS.Timeout | null = null
  private handlers: GestureHandler

  constructor(handlers: GestureHandler = {}) {
    this.handlers = handlers
  }

  attach(element: HTMLElement) {
    element.addEventListener("touchstart", this.onTouchStart.bind(this))
    element.addEventListener("touchend", this.onTouchEnd.bind(this))
    element.addEventListener("touchmove", this.onTouchMove.bind(this))
  }

  private onTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    if (!touch) return
    this.startX = touch.clientX
    this.startY = touch.clientY
    this.startTime = Date.now()
  }

  private onTouchMove() {
    // Handle swipe
  }

  private onTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return
    const endX = touch.clientX
    const endY = touch.clientY
    const duration = Date.now() - this.startTime

    const deltaX = endX - this.startX
    const deltaY = endY - this.startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Swipe detection
    if (distance > 50 && duration < 300) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && this.handlers.onSwipeRight) {
          this.handlers.onSwipeRight()
        } else if (deltaX < 0 && this.handlers.onSwipeLeft) {
          this.handlers.onSwipeLeft()
        }
      }
    }

    // Double tap detection
    if (distance < 30 && duration < 200) {
      this.tapCount++
      if (this.tapTimeout) clearTimeout(this.tapTimeout)

      if (this.tapCount === 2) {
        this.handlers.onDoubleTap?.(endX, endY)
        this.tapCount = 0
      } else {
        this.tapTimeout = setTimeout(() => {
          this.tapCount = 0
        }, 300)
      }
    }

    // Long press detection
    if (duration > 500 && distance < 30 && this.handlers.onLongPress) {
      this.handlers.onLongPress(endX, endY)
    }
  }
}
