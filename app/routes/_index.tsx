import { useEffect, useState } from "react"
import type { Route } from "./+types/_index"
import { ImageUploader, validateImageFile } from "../features/uploader"

export const meta: Route.MetaFunction = () => [
  { title: "Image to SVG Animation" },
  { name: "description", content: "Upload an image and animate it as SVG paths." },
]

type ConvertParams = {
  threshold: number
  turdSize: number
  alphaMax: number
  optTolerance: number
}

const defaultParams: ConvertParams = {
  threshold: 120,
  turdSize: 2,
  alphaMax: 1,
  optTolerance: 0.2,
}

type SliderFieldProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

function SliderField({ id, label, min, max, step, value, onChange }: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs opacity-60">
        <label htmlFor={id}>{label}</label>
        <span>{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
      />
    </div>
  )
}

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [params, setParams] = useState<ConvertParams>(defaultParams)
  const [isConverting, setIsConverting] = useState(false)
  const [svgResult, setSvgResult] = useState<string | null>(null)
  const [convertError, setConvertError] = useState<string | null>(null)

  function handleFileSelected(file: File | null) {
    if (file === null) {
      setSelectedFile(null)
      setUploadError(null)
      setSvgResult(null)
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
    setSvgResult(null)
    setConvertError(null)
  }

  function setParam<K extends keyof ConvertParams>(key: K, value: ConvertParams[K]) {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  async function handleConvert() {
    if (selectedFile === null) return

    setIsConverting(true)
    setConvertError(null)
    setSvgResult(null)

    const formData = new FormData()
    formData.append("image", selectedFile)
    formData.append("threshold", String(params.threshold))
    formData.append("turdSize", String(params.turdSize))
    formData.append("alphaMax", String(params.alphaMax))
    formData.append("optTolerance", String(params.optTolerance))

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })
      const data = (await response.json()) as { svg?: string; error?: string }
      if (!response.ok || data.error !== undefined) {
        setConvertError(data.error ?? "Conversion failed")
      } else if (data.svg !== undefined) {
        setSvgResult(data.svg)
      }
    } catch {
      setConvertError("Network error. Please try again.")
    } finally {
      setIsConverting(false)
    }
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
    <main className="min-h-screen flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Image to SVG Animation</h1>

      {objectUrl !== null && (
        <img
          src={objectUrl}
          alt="Selected image"
          className="max-w-xl max-h-80 rounded-md object-contain"
        />
      )}

      <ImageUploader onFileSelected={handleFileSelected} error={uploadError} />

      {selectedFile !== null && (
        <section
          className="w-full max-w-md flex flex-col gap-3 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
          aria-label="Conversion parameters"
        >
          <p className="text-xs font-medium opacity-60 uppercase tracking-widest">
            Trace Parameters
          </p>
          <SliderField
            id="threshold"
            label="Threshold"
            min={0}
            max={255}
            step={1}
            value={params.threshold}
            onChange={(v) => setParam("threshold", v)}
          />
          <SliderField
            id="turd-size"
            label="Turd Size (speckle removal)"
            min={0}
            max={10}
            step={1}
            value={params.turdSize}
            onChange={(v) => setParam("turdSize", v)}
          />
          <SliderField
            id="alpha-max"
            label="Alpha Max (corner rounding)"
            min={0}
            max={1.3334}
            step={0.01}
            value={params.alphaMax}
            onChange={(v) => setParam("alphaMax", v)}
          />
          <SliderField
            id="opt-tolerance"
            label="Opt Tolerance (curve smoothing)"
            min={0}
            max={1}
            step={0.01}
            value={params.optTolerance}
            onChange={(v) => setParam("optTolerance", v)}
          />
        </section>
      )}

      <button
        id="convert-button"
        disabled={selectedFile === null || isConverting}
        onClick={() => void handleConvert()}
        className="px-6 py-2 rounded-md border border-[var(--color-accent)] text-sm enabled:cursor-pointer enabled:hover:bg-[var(--color-accent-glow)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isConverting ? "Converting..." : "Convert"}
      </button>

      {convertError !== null && <p className="text-sm text-red-400 text-center">{convertError}</p>}

      {svgResult !== null && (
        <section className="w-full flex flex-col gap-2" aria-label="SVG output">
          <p className="text-xs font-medium opacity-60 uppercase tracking-widest">Traced SVG</p>
          <div
            className="w-full rounded-lg border border-[var(--color-border)] bg-white p-4 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgResult }}
          />
        </section>
      )}
    </main>
  )
}
