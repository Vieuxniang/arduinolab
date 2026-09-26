import type { SimType } from "./missions"

export type BlockType =
  | "led_on"
  | "led_off"
  | "read_sensor"
  | "write_lcd"
  | "pwm_motor"
  | "delay"

export interface PaletteBlock {
  type: BlockType
  labelKey: string
  color: string
}

export const PALETTE: PaletteBlock[] = [
  { type: "led_on", labelKey: "blk_led_on", color: "var(--chart-1)" },
  { type: "led_off", labelKey: "blk_led_off", color: "var(--muted-foreground)" },
  { type: "read_sensor", labelKey: "blk_read_sensor", color: "var(--chart-5)" },
  { type: "write_lcd", labelKey: "blk_write_lcd", color: "var(--chart-3)" },
  { type: "pwm_motor", labelKey: "blk_pwm_motor", color: "var(--chart-4)" },
  { type: "delay", labelKey: "blk_delay", color: "var(--chart-2)" },
]

const BLOCK_CODE: Record<BlockType, string[]> = {
  led_on: ["digitalWrite(LED_PIN, HIGH);"],
  led_off: ["digitalWrite(LED_PIN, LOW);"],
  read_sensor: ["int value = analogRead(SENSOR_PIN);"],
  write_lcd: ['lcd.print("ArduinoLab");'],
  pwm_motor: ["analogWrite(MOTOR_PIN, speed);"],
  delay: ["delay(1000);"],
}

export function generateCode(blocks: BlockType[]): string {
  const setup = [
    "// ArduinoLab generated sketch",
    "void setup() {",
    "  pinMode(LED_PIN, OUTPUT);",
    "  pinMode(MOTOR_PIN, OUTPUT);",
    "  Serial.begin(9600);",
    "}",
    "",
    "void loop() {",
  ]
  const body =
    blocks.length === 0
      ? ["  // empty program"]
      : blocks.flatMap((b) => BLOCK_CODE[b].map((l) => "  " + l))
  return [...setup, ...body, "}"].join("\n")
}

export function starterCodeForSim(sim: SimType): string {
  switch (sim) {
    case "led":
      return generateCode(["led_on", "delay", "led_off", "delay"])
    case "sensor":
      return generateCode(["read_sensor", "delay"])
    case "motor":
      return generateCode(["pwm_motor", "delay"])
    case "lcd":
      return generateCode(["write_lcd", "delay"])
    case "iot":
      return generateCode(["read_sensor", "write_lcd", "pwm_motor", "delay"])
    default:
      return generateCode([])
  }
}
