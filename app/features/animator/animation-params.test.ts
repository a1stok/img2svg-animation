import { describe, expect, test } from "vitest"
import { generateAnimationHtml, defaultAnimationParams } from "./animation-params"
import type { AnimationParams } from "./animation-params"

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0 0 L100 100" fill="#ff0000" /></svg>`

describe("generateAnimationHtml", () => {
  test("returns a complete HTML document", () => {
    const html = generateAnimationHtml(SAMPLE_SVG, defaultAnimationParams)
    expect(html).toContain("<!DOCTYPE html>")
    expect(html).toContain("<html")
    expect(html).toContain("</html>")
  })

  test("embeds the SVG string in the output", () => {
    const html = generateAnimationHtml(SAMPLE_SVG, defaultAnimationParams)
    expect(html).toContain(SAMPLE_SVG)
  })

  test("includes the animejs CDN import", () => {
    const html = generateAnimationHtml(SAMPLE_SVG, defaultAnimationParams)
    expect(html).toContain("esm.sh/animejs")
  })

  test("includes the configured duration", () => {
    const params: AnimationParams = { ...defaultAnimationParams, duration: 4500 }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain("duration: 4500")
  })

  test("includes stagger delay when delay > 0", () => {
    const params: AnimationParams = { ...defaultAnimationParams, delay: 200 }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain("stagger(200)")
  })

  test("uses plain 0 for delay when delay is 0", () => {
    const html = generateAnimationHtml(SAMPLE_SVG, defaultAnimationParams)
    expect(html).toContain("delay: 0")
    expect(html).not.toContain("stagger(0)")
  })

  test("includes alternate when direction is alternate", () => {
    const params: AnimationParams = { ...defaultAnimationParams, direction: "alternate" }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain("alternate: true")
  })

  test("includes animation.reverse() when direction is reverse", () => {
    const params: AnimationParams = { ...defaultAnimationParams, direction: "reverse" }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain("animation.reverse()")
  })

  test("applies fill: transparent CSS when fadeInFill is false", () => {
    const html = generateAnimationHtml(SAMPLE_SVG, defaultAnimationParams)
    expect(html).toContain("fill: transparent;")
    expect(html).not.toContain("fill-opacity: 0;")
  })

  test("applies fill-opacity CSS and fade animation when fadeInFill is true", () => {
    const params: AnimationParams = { ...defaultAnimationParams, fadeInFill: true }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain("fill-opacity: 0;")
    expect(html).toContain("fillOpacity: [0, 1]")
  })

  test("includes configured stroke width in CSS", () => {
    const params: AnimationParams = { ...defaultAnimationParams, strokeWidth: 3 }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain("stroke-width: 3px;")
  })

  test("includes the configured easing value", () => {
    const params: AnimationParams = { ...defaultAnimationParams, easing: "outBounce" }
    const html = generateAnimationHtml(SAMPLE_SVG, params)
    expect(html).toContain(`ease: "outBounce"`)
  })
})
