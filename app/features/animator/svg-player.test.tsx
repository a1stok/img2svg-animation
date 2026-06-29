import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { SvgPlayer } from "./svg-player"

test("renders SvgPlayer without crashing", () => {
  render(<SvgPlayer svgString="<svg><path d='M0 0' /></svg>" />)
  expect(screen.getByText(/Generated Config/i)).toBeDefined()
})
