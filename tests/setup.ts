import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// jsdom has no Web Speech API; the LAB-AI voice module needs a minimal stand-in
// so importing it (and scheduling speech) cannot crash a test.
class SpeechSynthesisUtteranceStub {
  text: string
  rate = 1
  pitch = 1
  volume = 1
  onend: (() => void) | null = null

  constructor(text = "") {
    this.text = text
  }
}

function stubGlobal(name: string, value: unknown) {
  Object.defineProperty(window, name, { configurable: true, writable: true, value })
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value })
}

stubGlobal("speechSynthesis", { speak: () => {}, cancel: () => {} })
stubGlobal("SpeechSynthesisUtterance", SpeechSynthesisUtteranceStub)

afterEach(() => {
  cleanup()
})
