import { useRef, useState } from "react"
import { validateImageFile } from "../uploader/validate-image-file"
import { toast } from "sonner"
import { Upload, FolderOpen } from "lucide-react"
import { Button } from "../../components/ui/button"

type BatchUploaderProps = {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function BatchUploader({ onFilesSelected, disabled }: BatchUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  function processFiles(rawFiles: FileList | File[]) {
    const files = Array.from(rawFiles)
    const valid: File[] = []
    const invalid: string[] = []

    for (const file of files) {
      const err = validateImageFile(file)
      if (err) {
        invalid.push(file.name)
      } else {
        valid.push(file)
      }
    }

    if (invalid.length > 0) {
      toast.error(`${invalid.length} file(s) skipped: unsupported type or over 5 MB.`)
    }

    if (valid.length > 0) {
      onFilesSelected(valid)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files)
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
      processFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg">
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 p-8 transition-all min-h-[160px]",
          disabled
            ? "opacity-50 pointer-events-none border-[var(--color-border)]"
            : isDragging
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 scale-[1.01]"
              : "border-[var(--color-border-light)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-raised)]/40",
        ].join(" ")}
      >
        <div className="p-3 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border-light)]">
          <Upload className="w-5 h-5 text-[var(--color-text-muted)]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--color-text)]">
            Drag &amp; drop images here
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            PNG, JPEG, WEBP — max 5 MB each
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Select Files
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Select Folder
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
        {/* webkitdirectory is non-standard but widely supported */}
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error — webkitdirectory is not in TypeScript's HTMLInputElement types
          webkitdirectory=""
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  )
}
