import { describe, it, expect } from "vitest"
import {
  GALLERY,
  LEVEL_ORDER,
  MISSIONS,
  type Mission,
  type SimType,
} from "@/lib/lab/missions"
import { PALETTE, generateCode, starterCodeForSim } from "@/lib/lab/code-gen"

const LANGS = ["fr", "en", "es"] as const
const ALL_SIMS: SimType[] = ["led", "sensor", "motor", "lcd", "iot"]

function mission(id: number): Mission {
  const m = MISSIONS.find((x) => x.id === id)
  if (!m) throw new Error(`mission ${id} is missing`)
  return m
}

describe("mission catalog", () => {
  it("has 45 missions with unique sequential ids", () => {
    expect(MISSIONS).toHaveLength(45)
    expect(MISSIONS.map((m) => m.id)).toEqual(
      Array.from({ length: 45 }, (_, i) => i + 1),
    )
  })

  it("has 15 missions per tier", () => {
    for (const level of LEVEL_ORDER) {
      expect(MISSIONS.filter((m) => m.level === level)).toHaveLength(15)
    }
  })

  it("gives every mission a valid simulator and translated texts", () => {
    for (const m of MISSIONS) {
      expect(ALL_SIMS).toContain(m.sim)
      expect(m.cost).toBeGreaterThan(0)
      expect(m.xp).toBeGreaterThan(0)
      for (const lang of LANGS) {
        expect(m.name[lang].length).toBeGreaterThan(0)
        expect(m.objective[lang].length).toBeGreaterThan(0)
      }
    }
  })

  it("increases cost and XP within each tier", () => {
    for (const level of LEVEL_ORDER) {
      const tier = MISSIONS.filter((m) => m.level === level)
      for (let i = 1; i < tier.length; i++) {
        const prev = tier[i - 1]
        const current = tier[i]
        if (!prev || !current) throw new Error(`tier ${level} is not dense`)
        expect(current.cost).toBeGreaterThan(prev.cost)
        expect(current.xp).toBeGreaterThan(prev.xp)
      }
    }
  })

  it("assigns the simulator that matches each mission topic", () => {
    expect(mission(1).sim).toBe("led") // LED clignotante
    expect(mission(4).sim).toBe("sensor") // Lecture température
    expect(mission(7).sim).toBe("lcd") // Texte sur LCD
    expect(mission(9).sim).toBe("motor") // Moteur simple
    expect(mission(15).sim).toBe("iot") // Mini dashboard
    expect(mission(22).sim).toBe("motor") // Servo angle
    expect(mission(30).sim).toBe("iot") // Dashboard IoT
    expect(mission(34).sim).toBe("lcd") // Interface LCD avancée
    expect(mission(45).sim).toBe("iot") // Projet final
  })

  it("exposes gallery items with valid levels and sims", () => {
    expect(GALLERY.length).toBeGreaterThan(0)
    for (const item of GALLERY) {
      expect(LEVEL_ORDER).toContain(item.level)
      expect(ALL_SIMS).toContain(item.sim)
      expect(item.code.length).toBeGreaterThan(0)
    }
  })
})

describe("code generation", () => {
  it("generates a complete sketch with setup and loop", () => {
    const code = generateCode(["led_on", "delay", "led_off"])
    expect(code).toContain("void setup() {")
    expect(code).toContain("void loop() {")
    expect(code).toContain("digitalWrite(LED_PIN, HIGH);")
    expect(code).toContain("delay(1000);")
    expect(code).toContain("digitalWrite(LED_PIN, LOW);")
    expect(code.trimEnd().endsWith("}")).toBe(true)
  })

  it("keeps block order when generating the program body", () => {
    const code = generateCode(["led_off", "led_on"])
    expect(code.indexOf("digitalWrite(LED_PIN, LOW);")).toBeLessThan(
      code.indexOf("digitalWrite(LED_PIN, HIGH);"),
    )
  })

  it("generates an empty program comment for no blocks", () => {
    expect(generateCode([])).toContain("// empty program")
  })

  it("generates code for every palette block", () => {
    for (const block of PALETTE) {
      const code = generateCode([block.type])
      expect(code).toContain("void loop() {")
      expect(code).not.toContain("// empty program")
    }
  })

  it("produces starter code tailored to each simulator", () => {
    expect(starterCodeForSim("led")).toContain("digitalWrite(LED_PIN, HIGH);")
    expect(starterCodeForSim("sensor")).toContain("analogRead(SENSOR_PIN);")
    expect(starterCodeForSim("motor")).toContain("analogWrite(MOTOR_PIN, speed);")
    expect(starterCodeForSim("lcd")).toContain('lcd.print("ArduinoLab");')
    const iot = starterCodeForSim("iot")
    expect(iot).toContain("analogRead(SENSOR_PIN);")
    expect(iot).toContain('lcd.print("ArduinoLab");')
    expect(iot).toContain("analogWrite(MOTOR_PIN, speed);")
  })
})
