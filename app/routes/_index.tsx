import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { Route } from "./+types/_index"
import { ImageUploader, validateImageFile } from "../features/uploader"
import { usePotrace } from "../features/potrace/use-potrace"
import { PotraceControls } from "../features/potrace/potrace-controls"
import { SvgPlayer } from "../features/animator/svg-player"
import { BackgroundAnimation } from "../components/ui/background-animation"

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

    // Smoothly scroll to the top so the user isn't disoriented when the layout changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-8 w-full max-w-4xl mx-auto">
      <header className="text-center flex flex-col gap-2 pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">SVG Animator</h1>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
          Upload any image to trace it into precise SVG paths and generate a custom drawing
          animation.
        </p>
      </header>

      <ImageUploader onFileSelected={handleFileSelected} error={null} />

      <AnimatePresence mode="popLayout">
        {selectedFile === null && (
          <motion.div
            key="initial-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            <p className="text-center text-[10px] sm:text-[11px] text-[var(--color-text-muted)] max-w-sm mx-auto -mt-4 mb-[45vh] relative z-10">
              <span className="font-semibold text-[var(--color-text)]">Tip:</span> Simple graphics
              and cartoon images trace into cleaner animation paths than detailed photos.
            </p>
            <BackgroundAnimation />
          </motion.div>
        )}

        {selectedFile !== null && (
          <motion.section
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col gap-6"
            aria-label="Conversion settings"
          >
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
          </motion.section>
        )}

        {objectUrl !== null && svgResult !== null && (
          <motion.section
            key="previews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="w-full flex flex-col gap-8"
            aria-label="Previews"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium opacity-60 uppercase tracking-widest text-center md:text-left">
                  Original Image
                </p>
                <div className="w-full h-full flex items-center justify-center">
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
                <div className="relative w-full h-full overflow-hidden">
                  {isConverting && (
                    <div className="absolute inset-0 bg-[var(--color-background)]/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <span className="text-xs font-medium">Updating...</span>
                    </div>
                  )}
                  <div
                    className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:max-w-xs [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:shadow-xl"
                    dangerouslySetInnerHTML={{ __html: svgResult ?? "" }}
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {svgResult !== null && (
          <motion.section
            key="animator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="w-full flex justify-center mt-8"
            aria-label="Animation Config"
          >
            <SvgPlayer svgString={svgResult} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
