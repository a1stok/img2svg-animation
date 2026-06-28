import { describe, expect, it } from "vitest"
import { validateImageFile } from "./validate-image-file"

function makeFile(type: string, sizeBytes: number): File {
  // File constructor: (parts, name, options)
  // We pass a single byte array padded to the desired size.
  const content = new Uint8Array(sizeBytes)
  return new File([content], "test-image", { type })
}

const FIVE_MB = 5 * 1024 * 1024

describe("validateImageFile", () => {
  it("returns null for a valid PNG under 5 MB", () => {
    const file = makeFile("image/png", FIVE_MB - 1)
    expect(validateImageFile(file)).toBeNull()
  })

  it("returns null for a valid JPEG under 5 MB", () => {
    const file = makeFile("image/jpeg", 1024)
    expect(validateImageFile(file)).toBeNull()
  })

  it("returns null for a valid WEBP under 5 MB", () => {
    const file = makeFile("image/webp", 1024)
    expect(validateImageFile(file)).toBeNull()
  })

  it("returns null for a file at exactly 5 MB (boundary)", () => {
    const file = makeFile("image/png", FIVE_MB)
    expect(validateImageFile(file)).toBeNull()
  })

  it("returns an error string for an unsupported type (image/gif)", () => {
    const file = makeFile("image/gif", 1024)
    const result = validateImageFile(file)
    expect(result).not.toBeNull()
    expect(typeof result).toBe("string")
    expect(result!.length).toBeGreaterThan(0)
  })

  it("returns an error string for a file over 5 MB", () => {
    const file = makeFile("image/png", FIVE_MB + 1)
    const result = validateImageFile(file)
    expect(result).not.toBeNull()
    expect(typeof result).toBe("string")
    expect(result!.length).toBeGreaterThan(0)
  })
})
