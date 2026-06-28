import { useEffect, useRef, useState } from "react"
import type { Route } from "./+types/_index"
import { ImageUploader, validateImageFile } from "../features/uploader"
import type { TurnPolicy } from "../services/potrace-service"

export const meta: Route.MetaFunction = () => [
  { title: "Image to SVG Animation" },
  { name: "description", content: "Upload an image and animate it as SVG paths." },
]

type ConvertParams = {
  threshold: number
  turdSize: number
  alphaMax: number
  optTolerance: number
  optCurve: boolean
  blackOnWhite: boolean
  turnPolicy: TurnPolicy
  color: string
  background: string
  isBgTransparent: boolean
}

const defaultParams: ConvertParams = {
  threshold: 120,
  turdSize: 2,
  alphaMax: 1,
  optTolerance: 0.2,
  optCurve: true,
  blackOnWhite: true,
  turnPolicy: "minority",
  color: "#000000",
  background: "#ffffff",
  isBgTransparent: true,
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

type ToggleFieldProps = {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

function ToggleField({ id, label, description, checked, onChange }: ToggleFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 cursor-pointer select-none"
    >
      <div className="flex flex-col">
        <span className="text-xs opacity-60">{label}</span>
        <span className="text-xs opacity-40">{description}</span>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[var(--color-accent)]"
      />
    </label>
  )
}

const TURN_POLICY_OPTIONS: { value: TurnPolicy; label: string }[] = [
  { value: "minority", label: "Minority" },
  { value: "majority", label: "Majority" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
]

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [params, setParams] = useState<ConvertParams>(defaultParams)
  const [isConverting, setIsConverting] = useState(false)
  const [svgResult, setSvgResult] = useState<string | null>(null)
  const [convertError, setConvertError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

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

  // Debounced auto-conversion: fires 100ms after file or params change.
  // AbortController cancels any in-flight request before starting a new one.
  useEffect(() => {
    if (selectedFile === null) return

    const controller = new AbortController()
    abortControllerRef.current = controller

    const timer = setTimeout(() => {
      void (async () => {
        setIsConverting(true)
        setConvertError(null)

        const formData = new FormData()
        formData.append("image", selectedFile)
        formData.append("threshold", String(params.threshold))
        formData.append("turdSize", String(params.turdSize))
        formData.append("alphaMax", String(params.alphaMax))
        formData.append("optTolerance", String(params.optTolerance))
        formData.append("optCurve", String(params.optCurve))
        formData.append("blackOnWhite", String(params.blackOnWhite))
        formData.append("turnPolicy", params.turnPolicy)
        formData.append("color", params.color)
        formData.append("background", params.isBgTransparent ? "transparent" : params.background)

        try {
          const response = await fetch("/api/convert", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          })
          const data = (await response.json()) as { svg?: string; error?: string }
          if (!response.ok || data.error !== undefined) {
            setConvertError(data.error ?? "Conversion failed")
          } else if (data.svg !== undefined) {
            setSvgResult(data.svg)
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return
          setConvertError("Network error. Please try again.")
        } finally {
          setIsConverting(false)
        }
      })()
    }, 100)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [selectedFile, params])

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
          className="w-full max-w-md flex flex-col gap-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
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

          <div className="border-t border-[var(--color-border)] pt-3 grid grid-cols-2 gap-3 mt-1">
            <div className="flex flex-col gap-1">
              <label htmlFor="color" className="text-xs opacity-60">
                Path Color
              </label>
              <input
                id="color"
                type="color"
                value={params.color}
                onChange={(e) => setParam("color", e.target.value)}
                className="w-full h-8 rounded border border-[var(--color-border)] cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label htmlFor="background" className="text-xs opacity-60">
                  Background
                </label>
                <label className="flex items-center gap-1 text-[10px] opacity-60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.isBgTransparent}
                    onChange={(e) => setParam("isBgTransparent", e.target.checked)}
                    className="accent-[var(--color-accent)]"
                  />
                  Transparent
                </label>
              </div>
              <input
                id="background"
                type="color"
                value={params.background}
                onChange={(e) => setParam("background", e.target.value)}
                disabled={params.isBgTransparent}
                className="w-full h-8 rounded border border-[var(--color-border)] cursor-pointer bg-transparent disabled:opacity-20 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] opacity-40 leading-tight">
                Background is just to preview how it fits your site; it won't be drawn in the
                animation.
              </span>
            </div>
          </div>

          <details className="group border-t border-[var(--color-border)] pt-3">
            <summary className="text-xs font-medium cursor-pointer opacity-80 hover:opacity-100 transition-opacity list-none flex justify-between items-center">
              Advanced Settings
              <span className="opacity-50 text-[10px] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>

            <div className="flex flex-col gap-4 mt-4">
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

              <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-3">
                <ToggleField
                  id="black-on-white"
                  label="Black on White"
                  description="Trace dark areas on light background. Uncheck to invert."
                  checked={params.blackOnWhite}
                  onChange={(v) => setParam("blackOnWhite", v)}
                />
                <ToggleField
                  id="opt-curve"
                  label="Curve Optimization"
                  description="Smooth curves using Bezier fitting."
                  checked={params.optCurve}
                  onChange={(v) => setParam("optCurve", v)}
                />
              </div>

              <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-2">
                <label htmlFor="turn-policy" className="text-xs opacity-60">
                  Turn Policy (path ambiguity resolution)
                </label>
                <select
                  id="turn-policy"
                  value={params.turnPolicy}
                  onChange={(e) => setParam("turnPolicy", e.target.value as TurnPolicy)}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm"
                >
                  {TURN_POLICY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </details>
        </section>
      )}

      {convertError !== null && <p className="text-sm text-red-400 text-center">{convertError}</p>}

      {(svgResult !== null || isConverting) && (
        <section className="w-full flex flex-col gap-2" aria-label="SVG output">
          <p className="text-xs font-medium opacity-60 uppercase tracking-widest">Traced SVG</p>
          <div className="relative w-full rounded-lg border border-[var(--color-border)] overflow-hidden">
            {isConverting && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <span className="text-xs text-black/50">Updating...</span>
              </div>
            )}
            {svgResult !== null && (
              <div
                className="w-full p-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/30 [&>svg]:w-full [&>svg]:max-w-xs [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:shadow-xl [&>svg]:bg-transparent"
                dangerouslySetInnerHTML={{ __html: svgResult }}
              />
            )}
          </div>
        </section>
      )}

      <button
        id="view-animations-button"
        disabled={svgResult === null}
        className="px-6 py-2 rounded-md border border-[var(--color-accent)] text-sm enabled:cursor-pointer enabled:hover:bg-[var(--color-accent-glow)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        View Animations
      </button>
    </main>
  )
}
