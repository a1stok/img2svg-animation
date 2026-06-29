import { useState } from "react"
import type { Route } from "./+types/_index"
import { ImageUploader, validateImageFile } from "../features/uploader"
import { usePotrace } from "../features/potrace/use-potrace"
import { PotraceControls } from "../features/potrace/potrace-controls"
import { SvgPlayer } from "../features/animator/svg-player"

export const meta: Route.MetaFunction = () => [
  { title: "Image to SVG Animation" },
  { name: "description", content: "Upload an image and animate it as SVG paths." },
]

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  const { params, setParam, isConverting, svgResult, convertError, resetState } =
    usePotrace(selectedFile)

  function handleFileSelected(file: File | null) {
    if (file === null) {
      setSelectedFile(null)
      setUploadError(null)
      resetState()
      return
    }

    const error = validateImageFile(file)
    if (error !== null) {
      setSelectedFile(null)
      setUploadError(error)
      return
    }

    setSelectedFile(file)
    setUploadError(null)
    resetState()

    // Create object URL for preview
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(URL.createObjectURL(file))
  }

  return (
    <div className="flex flex-col items-center py-12 px-4 gap-12 w-full max-w-4xl mx-auto">
      <header className="text-center flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">SVG Animator</h1>
        <p className="text-sm opacity-60">Upload an image to convert it into an animated SVG</p>
      </header>

      <ImageUploader onFileSelected={handleFileSelected} error={uploadError} />

      {selectedFile !== null && (
        <section className="w-full flex flex-col gap-6" aria-label="Conversion settings">
          <header className="flex justify-between items-end border-b border-[var(--color-border)] pb-2">
            <div>
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="text-xs opacity-60">
                Configure how the image is traced into SVG paths.
              </p>
            </div>
            {isConverting && (
              <span className="text-xs text-[var(--color-accent)] animate-pulse">
                Converting...
              </span>
            )}
          </header>

          <PotraceControls params={params} setParam={setParam} />
        </section>
      )}

      {convertError !== null && <p className="text-sm text-red-400 text-center">{convertError}</p>}

      {objectUrl !== null && (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Previews">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium opacity-60 uppercase tracking-widest text-center md:text-left">
              Original Image
            </p>
            <div className="w-full h-full p-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/30 rounded-lg border border-[var(--color-border)]">
              <img
                src={objectUrl}
                alt="Original"
                className="w-full max-w-xs h-auto rounded-xl shadow-xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium opacity-60 uppercase tracking-widest text-center md:text-left">
              Traced SVG
            </p>
            <div className="relative w-full h-full rounded-lg border border-[var(--color-border)] overflow-hidden">
              {isConverting && (
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center z-10">
                  <span className="text-xs font-medium">Updating...</span>
                </div>
              )}
              <div
                className="w-full h-full p-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/30 [&>svg]:w-full [&>svg]:max-w-xs [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:shadow-xl [&>svg]:bg-transparent"
                dangerouslySetInnerHTML={{ __html: svgResult ?? "" }}
              />
            </div>
          </div>
        </section>
      )}

      {svgResult !== null && (
        <section className="w-full flex justify-center mt-8" aria-label="Animation Config">
          <SvgPlayer svgString={svgResult} />
        </section>
      )}
    </div>
  )
}
