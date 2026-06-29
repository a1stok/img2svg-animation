import { useEffect, useState } from "react"
import { toast } from "sonner"
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
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  const { params, setParam, isConverting, svgResult, convertError, resetState } =
    usePotrace(selectedFile)

  useEffect(() => {
    if (convertError) {
      toast.error(convertError)
    }
  }, [convertError])

  function handleFileSelected(file: File | null) {
    if (file === null) {
      setSelectedFile(null)
      resetState()
      return
    }

    const error = validateImageFile(file)
    if (error !== null) {
      setSelectedFile(null)
      toast.error(error)
      return
    }

    setSelectedFile(file)
    resetState()

    // Create object URL for preview
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(URL.createObjectURL(file))
  }

  return (
    <div className="flex flex-col items-center py-12 px-4 gap-12 w-full max-w-4xl mx-auto">
      <section className="relative rounded-2xl w-full overflow-hidden shadow-sm">
        <div className="relative font-semibold h-[300px] sm:h-[350px] bg-gradient-to-t from-[var(--color-surface)] to-[var(--color-background)] flex flex-col items-center justify-center text-[var(--color-text)] before:absolute before:inset-0 before:content-[''] before:opacity-[0.02] before:z-10 before:pointer-events-none before:bg-[url('https://www.ui-layouts.com/noise.gif')]">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:35px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-3 text-center px-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              SVG Animator
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-md mx-auto font-normal">
              Upload any image to trace it into precise SVG paths and generate a custom drawing
              animation.
            </p>
          </div>
        </div>
      </section>

      <ImageUploader onFileSelected={handleFileSelected} error={null} />

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

      {objectUrl !== null && (
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Previews">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium opacity-60 uppercase tracking-widest text-center md:text-left">
              Original Image
            </p>
            <div className="w-full h-full p-8 flex items-center justify-center bg-white rounded-lg border border-[var(--color-border)]">
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
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <span className="text-xs font-medium">Updating...</span>
                </div>
              )}
              <div
                className="w-full h-full p-8 flex items-center justify-center bg-white [&>svg]:w-full [&>svg]:max-w-xs [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:shadow-xl [&>svg]:bg-transparent"
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
