import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import type { SDKLiteInstance, UserStateRecord } from "@/lib/sdklite-types"
import { MISSIONS, type Mission } from "@/lib/lab/missions"

const mocks = vi.hoisted(() => ({
  sdk: null as SDKLiteInstance | null,
  speak: vi.fn(),
}))

vi.mock("@/contexts/pi-auth-context", () => ({
  usePiAuth: () => ({ sdk: mocks.sdk }),
}))

vi.mock("@/lib/lab/voice-ai", () => ({
  labAI: { speak: mocks.speak },
}))

import { LabProvider, useLab } from "@/lib/lab/store"

const STARTING_LAB = 100

function mission(id: number): Mission {
  const m = MISSIONS.find((x) => x.id === id)
  if (!m) throw new Error(`mission ${id} is missing`)
  return m
}

function at(ids: number[], index: number): number {
  const id = ids[index]
  if (id === undefined) throw new Error(`no mission id at index ${index}`)
  return id
}

function makeSdk(getImpl?: (key: string) => Promise<UserStateRecord | null>) {
  const get = vi.fn(getImpl ?? (() => Promise.resolve(null)))
  const set = vi.fn(() => Promise.resolve())
  const sdk: SDKLiteInstance = {
    login: () => Promise.resolve(true),
    makePurchase: () => Promise.reject(new Error("not used in tests")),
    showInterstitial: () => Promise.resolve(false),
    showRewarded: () => Promise.resolve(false),
    isAdNetworkSupported: () => Promise.resolve(false),
    state: {
      get,
      set,
      products: () => Promise.resolve({ products: [] }),
      purchases: () => Promise.resolve({ purchases: [] }),
      consume: () => Promise.resolve({ productId: "", quantity: 0 }),
      restore: () => Promise.resolve({ purchases: [] }),
    },
  }
  return { sdk, get, set }
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <LabProvider uid="test-uid">{children}</LabProvider>
)

describe("lab store", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.sdk = null
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("starts with default progress when no SDK is available", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    expect(result.current.ready).toBe(true)
    expect(result.current.xp).toBe(0)
    expect(result.current.lab).toBe(STARTING_LAB)
    expect(result.current.completed).toEqual([])
    expect(result.current.lang).toBe("fr")
    expect(result.current.langChosen).toBe(false)
    expect(result.current.userLevel).toBe("LPI1")
    expect(result.current.level).toBe(1)
    expect(result.current.totalMissions).toBe(MISSIONS.length)
    expect(result.current.soundEnabled).toBe(true)
    expect(result.current.gameMode).toBe("standard")
  })

  it("restores saved progress from the Pi user state", async () => {
    const record: UserStateRecord = {
      blob: {
        xp: 250,
        lab: 40,
        completed: [1, 2],
        lang: "en",
        langChosen: true,
      },
      updatedAt: "2026-01-01T00:00:00.000Z",
      version: 1,
    }
    const { sdk, get } = makeSdk(() => Promise.resolve(record))
    mocks.sdk = sdk

    const { result } = renderHook(() => useLab(), { wrapper })
    await waitFor(() => expect(result.current.ready).toBe(true))

    expect(get).toHaveBeenCalledWith("arduinolab.progress")
    expect(result.current.xp).toBe(250)
    expect(result.current.lab).toBe(40)
    expect(result.current.completed).toEqual([1, 2])
    expect(result.current.lang).toBe("en")
    expect(result.current.langChosen).toBe(true)
  })

  it("ignores malformed saved values", async () => {
    const record: UserStateRecord = {
      blob: {
        xp: -5,
        lab: "rich",
        completed: [2, "3", 99, -1, 4.5, 7],
        lang: "xx",
        langChosen: "yes",
      },
      updatedAt: "2026-01-01T00:00:00.000Z",
      version: 1,
    }
    mocks.sdk = makeSdk(() => Promise.resolve(record)).sdk

    const { result } = renderHook(() => useLab(), { wrapper })
    await waitFor(() => expect(result.current.ready).toBe(true))

    expect(result.current.xp).toBe(0)
    expect(result.current.lab).toBe(STARTING_LAB)
    expect(result.current.completed).toEqual([2, 7])
    expect(result.current.lang).toBe("fr")
    expect(result.current.langChosen).toBe(false)
  })

  it("awards XP and LAB when a mission is completed", () => {
    const m = mission(1)
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.completeMission(m.id)
    })

    expect(result.current.completed).toEqual([m.id])
    expect(result.current.xp).toBe(m.xp)
    expect(result.current.lab).toBe(STARTING_LAB + Math.round(m.cost * 1.5))
  })

  it("cannot claim the same mission reward twice", () => {
    const m = mission(1)
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.completeMission(m.id)
      result.current.completeMission(m.id)
    })

    expect(result.current.completed).toEqual([m.id])
    expect(result.current.xp).toBe(m.xp)
    expect(result.current.lab).toBe(STARTING_LAB + Math.round(m.cost * 1.5))
  })

  it("ignores unknown mission ids", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.completeMission(999)
    })

    expect(result.current.completed).toEqual([])
    expect(result.current.xp).toBe(0)
    expect(result.current.lab).toBe(STARTING_LAB)
  })

  it("spends LAB for a mission and reports success synchronously", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    let ok = true
    act(() => {
      ok = result.current.spendForMission(30)
    })

    expect(ok).toBe(true)
    expect(result.current.lab).toBe(STARTING_LAB - 30)
  })

  it("refuses to spend more LAB than available and keeps the balance", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    let ok = true
    act(() => {
      ok = result.current.spendForMission(STARTING_LAB + 1)
    })

    expect(ok).toBe(false)
    expect(result.current.lab).toBe(STARTING_LAB)
  })

  it("allows spending the exact balance", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    let ok = false
    act(() => {
      ok = result.current.spendForMission(STARTING_LAB)
    })

    expect(ok).toBe(true)
    expect(result.current.lab).toBe(0)
  })

  it("supports spending and completing in the same batch", () => {
    const m = mission(1)
    const { result } = renderHook(() => useLab(), { wrapper })

    let ok = false
    act(() => {
      ok = result.current.spendForMission(m.cost)
      result.current.completeMission(m.id)
    })

    expect(ok).toBe(true)
    expect(result.current.completed).toEqual([m.id])
    expect(result.current.lab).toBe(
      STARTING_LAB - m.cost + Math.round(m.cost * 1.5),
    )
  })

  it("tracks the LAB balance with addLab and canAfford", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.addLab(25)
    })

    expect(result.current.lab).toBe(STARTING_LAB + 25)
    expect(result.current.canAfford(STARTING_LAB + 25)).toBe(true)
    expect(result.current.canAfford(STARTING_LAB + 26)).toBe(false)
  })

  it("keeps higher tiers locked until the previous tier is complete", () => {
    const beginner = MISSIONS.filter((m) => m.level === "beginner").map((m) => m.id)
    const intermediate = MISSIONS.filter((m) => m.level === "intermediate").map((m) => m.id)
    const expert = MISSIONS.filter((m) => m.level === "expert").map((m) => m.id)
    const { result } = renderHook(() => useLab(), { wrapper })

    // Tiers are gated, not individual missions.
    expect(result.current.isUnlocked(at(beginner, 0))).toBe(true)
    expect(result.current.isUnlocked(at(beginner, 4))).toBe(true)
    expect(result.current.isUnlocked(at(intermediate, 0))).toBe(false)
    expect(result.current.isUnlocked(at(expert, 0))).toBe(false)

    act(() => {
      beginner.forEach((id) => result.current.completeMission(id))
    })

    expect(result.current.isLevelComplete("beginner")).toBe(true)
    expect(result.current.isUnlocked(at(intermediate, 0))).toBe(true)
    expect(result.current.isUnlocked(at(expert, 0))).toBe(false)

    act(() => {
      intermediate.forEach((id) => result.current.completeMission(id))
    })

    expect(result.current.isLevelComplete("intermediate")).toBe(true)
    expect(result.current.isUnlocked(at(expert, 0))).toBe(true)
  })

  it("levels up as XP grows", () => {
    const m = mission(45)
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.completeMission(m.id)
    })

    expect(result.current.level).toBe(1 + Math.floor(m.xp / 300))
    expect(result.current.userLevel).toBe(`LPI${result.current.level}`)
  })

  it("computes the combo multiplier from the streak count", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.updateCombo(3)
    })
    expect(result.current.combo).toMatchObject({
      count: 3,
      multiplier: 1.5,
      active: true,
    })

    act(() => {
      result.current.updateCombo(0)
    })
    expect(result.current.combo).toMatchObject({
      count: 0,
      multiplier: 1,
      active: false,
    })
  })

  it("switches language and confirms the choice", () => {
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.setLang("es")
    })
    expect(result.current.lang).toBe("es")
    expect(result.current.langChosen).toBe(false)

    act(() => {
      result.current.confirmLang("en")
    })
    expect(result.current.lang).toBe("en")
    expect(result.current.langChosen).toBe(true)
  })

  it("announces completion with LAB-AI only when sound is enabled", () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useLab(), { wrapper })

    act(() => {
      result.current.completeMission(1)
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(mocks.speak).toHaveBeenCalledWith("success")

    mocks.speak.mockClear()
    act(() => {
      result.current.toggleSound()
    })
    act(() => {
      result.current.completeMission(2)
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.soundEnabled).toBe(false)
    expect(mocks.speak).not.toHaveBeenCalled()
  })

  it("saves progress to the Pi user state after the debounce delay", async () => {
    vi.useFakeTimers()
    const m = mission(1)
    const { sdk, set } = makeSdk()
    mocks.sdk = sdk

    const { result } = renderHook(() => useLab(), { wrapper })
    // Let the initial load settle before mutating progress.
    await act(async () => {})

    act(() => {
      result.current.completeMission(m.id)
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(set).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(set).toHaveBeenCalledTimes(1)
    expect(set).toHaveBeenCalledWith("arduinolab.progress", {
      lang: "fr",
      xp: m.xp,
      lab: STARTING_LAB + Math.round(m.cost * 1.5),
      completed: [m.id],
      langChosen: false,
    })
  })
})
