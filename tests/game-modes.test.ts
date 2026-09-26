import { describe, it, expect, vi, afterEach } from "vitest"
import {
  calculateComboMultiplier,
  calculateTimeAttackBonus,
  checkComboExpired,
  isTimeAttackValid,
  startTimeAttack,
} from "@/lib/lab/game-modes"

describe("game modes", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("scales the combo multiplier every 3 streak steps", () => {
    expect(calculateComboMultiplier(0)).toBe(1)
    expect(calculateComboMultiplier(2)).toBe(1)
    expect(calculateComboMultiplier(3)).toBe(1.5)
    expect(calculateComboMultiplier(6)).toBe(2)
    expect(calculateComboMultiplier(7)).toBe(2)
  })

  it("expires combos after the streak window", () => {
    const now = 1_000_000
    vi.spyOn(Date, "now").mockReturnValue(now)

    expect(checkComboExpired(now - 1000)).toBe(false)
    expect(checkComboExpired(now - 300_001)).toBe(true)
    expect(checkComboExpired(now - 60_000, 30_000)).toBe(true)
  })

  it("builds a time attack with a fixed window", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000)

    const challenge = startTimeAttack("m1", 60)

    expect(challenge.timeLimit).toBe(60_000)
    expect(challenge.endTime - challenge.startTime).toBe(60_000)
    expect(challenge.completed).toBe(false)
    expect(challenge.baseReward).toBe(50)
  })

  it("pays a bigger time-attack bonus for faster completions", () => {
    const start = 1_000_000
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(start)
    const challenge = startTimeAttack("m1", 60)

    nowSpy.mockReturnValue(start + 15_000)
    const fast = calculateTimeAttackBonus({ ...challenge, completed: true })

    nowSpy.mockReturnValue(start + 60_000)
    const slow = calculateTimeAttackBonus({ ...challenge, completed: true })

    expect(fast).toBe(Math.floor(50 * 1.75))
    expect(slow).toBe(50)
    expect(fast).toBeGreaterThan(slow)
  })

  it("clamps the time-attack bonus at the limit and floors it at 10", () => {
    const start = 1_000_000
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(start)
    const challenge = startTimeAttack("m1", 60)

    expect(
      calculateTimeAttackBonus({ ...challenge, completed: false }),
    ).toBe(0)

    // Overtime is clamped to the time limit instead of shrinking further.
    nowSpy.mockReturnValue(start + 120_000)
    expect(
      calculateTimeAttackBonus({ ...challenge, completed: true }),
    ).toBe(50)

    nowSpy.mockReturnValue(start + 60_000)
    expect(
      calculateTimeAttackBonus({
        ...challenge,
        completed: true,
        baseReward: 5,
      }),
    ).toBe(10)
  })

  it("validates the time attack deadline", () => {
    const start = 1_000_000
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(start)
    const challenge = startTimeAttack("m1", 60)

    nowSpy.mockReturnValue(start + 59_999)
    expect(isTimeAttackValid(challenge)).toBe(true)

    nowSpy.mockReturnValue(start + 60_000)
    expect(isTimeAttackValid(challenge)).toBe(false)
  })
})
