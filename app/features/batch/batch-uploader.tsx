import { useRef, useState } from "react"
import { validateImageFile } from "../uploader/validate-image-file"
import { toast } from "sonner"
import { Upload, FolderOpen } from "lucide-react"
import { Button } from "../../components/ui/button"
import { DitherImageFrame } from "../../components/ui/dither-image"

type BatchUploaderProps = {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

const ACCEPTED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"])

export function BatchUploader({ onFilesSelected, disabled }: BatchUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  function processFiles(rawFiles: FileList | File[], fromFolder = false) {
    const files = Array.from(rawFiles)

    // When coming from a folder, silently skip non-image files (e.g. .DS_Store,
    // Thumbs.db, text docs) — the user knows folders have mixed content.
    // When coming from explicit file selection, warn about invalid picks.
    const imageFiles = fromFolder
      ? files.filter((f) => {
          if (f.type && ACCEPTED_MIME_TYPES.has(f.type)) return true
          const ext = f.name.toLowerCase().split(".").pop()
          return ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp"
        })
      : files

    const valid: File[] = []
    const invalid: string[] = []

    for (const file of imageFiles) {
      const err = validateImageFile(file)
      if (err) {
        invalid.push(file.name)
      } else {
        valid.push(file)
      }
    }

    if (!fromFolder && invalid.length > 0) {
      toast.error(`${invalid.length} file(s) skipped: unsupported type or over 5 MB.`)
    } else if (fromFolder && invalid.length > 0) {
      // Only warn about size violations from folders (type was already filtered)
      toast.warning(`${invalid.length} image(s) skipped: over 5 MB limit.`)
    }

    if (valid.length > 0) {
      onFilesSelected(valid)
    } else if (fromFolder && files.length > 0 && valid.length === 0) {
      toast.error("No supported images found in that folder.")
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>, fromFolder = false) {
    if (e.target.files) processFiles(e.target.files, fromFolder)
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
    if (e.dataTransfer.files.length > 0) {
      // Drag-and-drop — treat as folder-like (silently skip non-images)
      processFiles(e.dataTransfer.files, true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto">
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative overflow-hidden w-full rounded-2xl flex flex-col items-center justify-center transition-all min-h-[160px]",
          disabled
            ? "opacity-50 pointer-events-none ring-2 ring-transparent"
            : isDragging
              ? "ring-2 ring-[var(--color-accent)] scale-[1.02] cursor-pointer"
              : "ring-2 ring-transparent hover:ring-[var(--color-accent)]/30 hover:scale-[1.01] cursor-pointer",
        ].join(" ")}
      >
        {/* Dither background — same as single uploader */}
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
          <div className="absolute inset-0 bg-[#0A192F]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#1E3A8A]/40 mix-blend-color" />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[var(--color-background)]/80 via-[var(--color-background)]/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4 p-8 text-center">
          <div className="p-4 rounded-full bg-[var(--color-surface-raised)]/80 backdrop-blur-sm border border-[var(--color-border-light)] shadow-xl mb-2">
            <Upload className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-base font-semibold tracking-tight">
            Drag &amp; drop images here, or click to select
          </p>
          <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-sunken)]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[var(--color-border)]">
            PNG, JPEG, WEBP — max 5 MB each
          </p>

          {/* Folder button — separate from click-to-select so it targets the folder input */}
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 bg-[var(--color-surface-raised)]/80 backdrop-blur-sm border-[var(--color-border-light)] hover:bg-[var(--color-surface-hover)]"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Select Folder
            </Button>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => handleFileInput(e, false)}
          className="hidden"
        />
        {/* webkitdirectory is non-standard but has broad browser support */}
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error — webkitdirectory is not in TypeScript's HTMLInputElement types
          webkitdirectory=""
          multiple
          onChange={(e) => handleFileInput(e, true)}
          className="hidden"
        />
      </div>
    </div>
  )
}
