export type HapticType = "light" | "medium" | "heavy" | "success" | "error" | "selection"

export const useHaptics = () => {
  const vibrate = (type: HapticType) => {
    if (!navigator.vibrate) return

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 30,
      heavy: 50,
      success: [30, 15, 30],
      error: [50, 30, 50],
      selection: 15,
    }

    navigator.vibrate(patterns[type])
  }

  return { vibrate }
}
