// Potrace service: preprocesses an image with sharp and converts it to an SVG string.
// Called exclusively from the api.convert route on the server.

export type PotraceParams = {
  threshold: number
  turdSize: number
  alphaMax: number
  optTolerance: number
}

export const defaultPotraceParams: PotraceParams = {
  threshold: 120,
  turdSize: 2,
  alphaMax: 1,
  optTolerance: 0.2,
}

export async function traceImageToSvg(
  imageBuffer: Buffer,
  params: PotraceParams = defaultPotraceParams,
): Promise<string> {
  const sharp = (await import("sharp")).default

  // Preprocess: grayscale + normalize (auto-contrast) for a cleaner trace
  const preprocessed = await sharp(imageBuffer).grayscale().normalize().toBuffer()

  // Dynamic import keeps potrace out of the client bundle
  const potrace = await import("potrace")

  return new Promise((resolve, reject) => {
    potrace.trace(
      preprocessed,
      {
        threshold: params.threshold,
        turdSize: params.turdSize,
        alphaMax: params.alphaMax,
        optTolerance: params.optTolerance,
      },
      (err: Error | null, svg: string) => {
        if (err) return reject(err)
        resolve(svg)
      },
    )
  })
}
