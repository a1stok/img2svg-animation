import { render, screen } from "@testing-library/react"
import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { SvgPlayer } from "./svg-player"

vi.mock("animejs", () => ({
  animate: vi.fn(() => ({
    pause: vi.fn(),
    play: vi.fn(),
    restart: vi.fn(),
    reverse: vi.fn(),
  })),
  stagger: vi.fn((value: number) => value),
  svg: {
    createDrawable: vi.fn((paths: NodeListOf<SVGPathElement>) => Array.from(paths)),
  },
}))

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

afterAll(() => {
  vi.unstubAllGlobals()
})

test("renders SvgPlayer without crashing", () => {
  render(<SvgPlayer svgString="<svg><path d='M0 0' /></svg>" />)
  expect(screen.getByText(/Integration Guide/i)).toBeDefined()
})
