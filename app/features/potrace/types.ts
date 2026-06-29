import type { TurnPolicy } from "../../services/potrace-service"

export type { TurnPolicy }

export type ConvertParams = {
  threshold: number
  turdSize: number
  alphaMax: number
  optTolerance: number
  optCurve: boolean
  blackOnWhite: boolean
  turnPolicy: TurnPolicy
  color: string
  background: string
  isBgTransparent: boolean
}

export const defaultParams: ConvertParams = {
  threshold: 120,
  turdSize: 2,
  alphaMax: 1,
  optTolerance: 0.2,
  optCurve: true,
  blackOnWhite: true,
  turnPolicy: "minority",
  color: "#000000",
  background: "#ffffff",
  isBgTransparent: true,
}
