import { useEffect, useState } from "react"
import type { Route } from "./+types/_index"
import { ImageUploader, validateImageFile } from "../features/uploader"

export const meta: Route.MetaFunction = () => [
  { title: "Image to SVG Animation" },
  { name: "description", content: "Upload an image and animate it as SVG paths." },
]

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  function handleFileSelected(file: File | null) {
    if (file === null) {
      setSelectedFile(null)
      setUploadError(null)
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
  }

  useEffect(() => {
    if (selectedFile === null) {
      setObjectUrl(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Image to SVG Animation</h1>

      {objectUrl !== null && (
        <img
          src={objectUrl}
          alt="Selected image"
          className="max-w-xl max-h-80 rounded-md object-contain"
        />
      )}

      <ImageUploader onFileSelected={handleFileSelected} error={uploadError} />

      <button
        disabled
        className="px-6 py-2 rounded-md border border-[var(--color-border)] opacity-40 cursor-not-allowed text-sm"
      >
        Convert
      </button>
    </main>
  )
}
