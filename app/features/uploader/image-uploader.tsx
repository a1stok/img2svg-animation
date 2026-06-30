import { useRef, useState } from "react"
import { DitherImageFrame, DitherImageContent } from "../../components/ui/dither-image"

type ImageUploaderProps = {
  onFileSelected: (file: File | null, error: string | null) => void
  error: string | null
  isMinimized?: boolean
}

export function ImageUploader({ onFileSelected, error, isMinimized = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    onFileSelected(file, null)
    // Reset so selecting the same file again triggers onChange
    e.target.value = ""
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0] ?? null
    onFileSelected(file, null)
  }

  function handleClick() {
    inputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-lg">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative overflow-hidden w-full rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isMinimized ? "min-h-[80px]" : "min-h-[160px]",
          isDragging
            ? "ring-2 ring-[var(--color-accent)] scale-[1.02]"
            : "ring-2 ring-transparent hover:ring-[var(--color-accent)]/30 hover:scale-[1.01]",
        ].join(" ")}
      >
        {/* Dither background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DitherImageFrame
            size="md"
            grayscale={0.9}
            contrast={160}
            brightness={1.1}
            opacity={1}
            rounded={false}
            className="w-full h-full"
          >
            <video
              src="/ink-vid.mp4"
              autoPlay
              muted
              playsInline
              onTimeUpdate={(e) => {
                const video = e.currentTarget
                if (video.currentTime >= 15) {
                  video.pause()
                }
              }}
              className="absolute inset-0 w-full h-full object-cover dark:invert"
            />
          </DitherImageFrame>
          {/* Intense dark blue colour tint */}
          <div className="absolute inset-0 bg-[#0A192F]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#1E3A8A]/40 mix-blend-color" />
        </div>

        {/* Gradient overlay so content text stays readable */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[var(--color-background)]/80 via-[var(--color-background)]/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div
          className={[
            "relative z-10 flex items-center justify-center w-full transition-all duration-500",
            isMinimized ? "p-4 flex-row gap-4" : "p-8 flex-col gap-4 text-center",
          ].join(" ")}
        >
          <div
            className={[
              "rounded-full bg-[var(--color-surface-raised)]/80 backdrop-blur-sm border border-[var(--color-border-light)] shadow-xl transition-all duration-500 flex items-center justify-center shrink-0",
              isMinimized ? "w-10 h-10 p-2" : "w-14 h-14 p-4 mb-2",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={[
                "text-[var(--color-text-muted)] transition-all duration-500",
                isMinimized ? "w-5 h-5" : "w-6 h-6",
              ].join(" ")}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </div>

          <div
            className={[
              "flex flex-col transition-all duration-500",
              isMinimized ? "items-start text-left" : "items-center text-center gap-4",
            ].join(" ")}
          >
            <p
              className={[
                "font-semibold tracking-tight transition-all duration-500",
                isMinimized ? "text-sm" : "text-base",
              ].join(" ")}
            >
              {isMinimized
                ? "Click or drag to change image"
                : "Drag and drop an image here, or click to select"}
            </p>
            <div
              className={[
                "overflow-hidden transition-all duration-500",
                isMinimized ? "h-0 opacity-0" : "h-auto opacity-100",
              ].join(" ")}
            >
              <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-sunken)]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[var(--color-border)] inline-block">
                PNG, JPEG, WEBP — max 5 MB
              </p>
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error !== null && <p className="text-sm text-red-400 text-center">{error}</p>}
    </div>
  )
}
