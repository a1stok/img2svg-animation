import type { ConvertParams } from "../potrace/conversion-options"
import type { AnimationParams } from "../animator/animation-params"

export type BatchItemStatus = "pending" | "converting" | "done" | "error"

export type BatchItem = {
  id: string
  file: File
  status: BatchItemStatus
  svgResult: string | null
  errorMessage: string | null
  traceOverride: ConvertParams | null
  animOverride: AnimationParams | null
}
