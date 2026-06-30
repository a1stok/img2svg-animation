import { describe, expect, it } from "vitest"
import {
  appendConvertParamsToFormData,
  defaultParams,
  parseConvertParamsFromFormData,
  type ConvertParams,
} from "./conversion-options"

function expectParsedParams(formData: FormData): ConvertParams {
  const parsed = parseConvertParamsFromFormData(formData)
  expect(parsed.success).toBe(true)

  if (!parsed.success) {
    throw new Error("Expected conversion params to parse successfully")
  }

  return parsed.data
}

describe("conversion options contract", () => {
  it("uses one default parameter set for the conversion boundary", () => {
    const parsed = expectParsedParams(new FormData())

    expect(parsed).toEqual(defaultParams)
    expect(defaultParams).toEqual({
      threshold: 120,
      turdSize: 2,
      alphaMax: 1,
      optTolerance: 0.2,
      optCurve: true,
      blackOnWhite: true,
      turnPolicy: "minority",
      color: "#000000",
      background: "#ffffff",
    })
  })

  it("round-trips params through FormData", () => {
    const params: ConvertParams = {
      threshold: 200,
      turdSize: 4,
      alphaMax: 1.2,
      optTolerance: 0.35,
      optCurve: false,
      blackOnWhite: false,
      turnPolicy: "right",
      color: "#123456",
      background: "#abcdef",
    }

    const formData = appendConvertParamsToFormData(new FormData(), params)
    expect(expectParsedParams(formData)).toEqual(params)
  })

  it("coerces string form values into the service-safe parameter shape", () => {
    const formData = new FormData()
    formData.set("threshold", "10")
    formData.set("turdSize", "3")
    formData.set("alphaMax", "0.75")
    formData.set("optTolerance", "0.12")
    formData.set("optCurve", "false")
    formData.set("blackOnWhite", "true")
    formData.set("turnPolicy", "majority")
    formData.set("color", "#111111")
    formData.set("background", "#eeeeee")

    expect(expectParsedParams(formData)).toEqual({
      threshold: 10,
      turdSize: 3,
      alphaMax: 0.75,
      optTolerance: 0.12,
      optCurve: false,
      blackOnWhite: true,
      turnPolicy: "majority",
      color: "#111111",
      background: "#eeeeee",
    })
  })

  it("rejects invalid numeric bounds and turn policies", () => {
    const formData = appendConvertParamsToFormData(new FormData(), defaultParams)
    formData.set("threshold", "300")
    formData.set("turnPolicy", "clockwise")

    const parsed = parseConvertParamsFromFormData(formData)

    expect(parsed.success).toBe(false)
  })

  it("rejects non-boolean form values for boolean params", () => {
    const formData = appendConvertParamsToFormData(new FormData(), defaultParams)
    formData.set("optCurve", "yes")

    const parsed = parseConvertParamsFromFormData(formData)

    expect(parsed.success).toBe(false)
  })
})
