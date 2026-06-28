// Potrace service: converts a raw image Buffer into an SVG string.
// Called exclusively from the api.convert route on the server.

export async function traceImageToSvg(imageBuffer: Buffer): Promise<string> {
  // Dynamic import keeps potrace out of the client bundle
  const potrace = await import("potrace")

  return new Promise((resolve, reject) => {
    potrace.trace(imageBuffer, (err: Error | null, svg: string) => {
      if (err) return reject(err)
      resolve(svg)
    })
  })
}
