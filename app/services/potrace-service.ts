// Potrace service: preprocesses an image with sharp and converts it to an SVG string.
// Called exclusively from the api.convert route on the server.

import { defaultParams, type ConvertParams, type TurnPolicy } from "../features/potrace/types"

export type { TurnPolicy }
export type PotraceParams = ConvertParams
export const defaultPotraceParams: PotraceParams = defaultParams

export async function traceImageToSvg(
  imageBuffer: Buffer,
  params: PotraceParams = defaultPotraceParams,
): Promise<string> {
  const sharp = (await import("sharp")).default

  // Preprocess: grayscale + normalize (auto-contrast) for a cleaner trace, and output PNG for potrace compatibility
  const preprocessed = await sharp(imageBuffer).grayscale().normalize().png().toBuffer()

  // Dynamic import keeps potrace out of the client bundle
  const potrace = await import("potrace")

  return new Promise((resolve, reject) => {
    // @types/potrace has a typo: it declares 'turdPolicy' but the runtime reads 'turnPolicy'.
    // Building options as a Record bypasses the incorrect type definition.
    const traceOptions: Record<string, unknown> = {
      threshold: params.threshold,
      turdSize: params.turdSize,
      alphaMax: params.alphaMax,
      optTolerance: params.optTolerance,
      optCurve: params.optCurve,
      turnPolicy: params.turnPolicy,
      blackOnWhite: params.blackOnWhite,
      color: params.color,
      background: params.background,
    }

    potrace.trace(
      preprocessed,
      traceOptions as Parameters<typeof potrace.trace>[1],
      (err: Error | null, svg: string) => {
        if (err) return reject(err)
        resolve(svg)
      },
    )
  })
}
