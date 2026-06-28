import { beforeAll, describe, expect, it } from "vitest"
import { defaultPotraceParams, traceImageToSvg } from "./potrace-service"

// Use sharp itself to generate valid PNG buffers for testing.
// This avoids hardcoded hex bytes that may be malformed.
let whitePng: Buffer
let blackPng: Buffer

beforeAll(async () => {
  const sharp = (await import("sharp")).default

  whitePng = await sharp({
    create: { width: 4, height: 4, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .png()
    .toBuffer()

  blackPng = await sharp({
    create: { width: 4, height: 4, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .png()
    .toBuffer()
})

describe("traceImageToSvg", () => {
  it("returns a non-empty SVG string for a valid image buffer", async () => {
    const svg = await traceImageToSvg(whitePng, defaultPotraceParams)
    expect(typeof svg).toBe("string")
    expect(svg.length).toBeGreaterThan(0)
    expect(svg).toContain("<svg")
  })

  it("returns a string containing an svg element for a non-trivial image", async () => {
    const svg = await traceImageToSvg(blackPng, defaultPotraceParams)
    expect(svg).toContain("<svg")
  })
})
