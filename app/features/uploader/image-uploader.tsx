import { useRef, useState } from "react"

type ImageUploaderProps = {
  onFileSelected: (file: File | null, error: string | null) => void
  error: string | null
}

export function ImageUploader({ onFileSelected, error }: ImageUploaderProps) {
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
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "w-full border-2 border-dashed rounded-lg p-12 flex flex-col items-center gap-3 cursor-pointer transition-colors",
          isDragging
            ? "border-[var(--color-accent)] bg-[var(--color-surface-raised)]"
            : "border-[var(--color-border)] hover:border-[var(--color-accent)]",
        ].join(" ")}
      >
        <p className="text-sm opacity-60">Drag and drop an image here, or click to select</p>
        <p className="text-xs opacity-40">PNG, JPEG, WEBP — max 5 MB</p>
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
