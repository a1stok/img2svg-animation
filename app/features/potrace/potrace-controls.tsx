import type { ConvertParams } from "./types"

type SliderFieldProps = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

export function SliderField({ id, label, min, max, step, value, onChange }: SliderFieldProps) {
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

export function ToggleField({ id, label, description, checked, onChange }: ToggleFieldProps) {
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

export type PotraceControlsProps = {
  params: ConvertParams
  setParam: <K extends keyof ConvertParams>(key: K, value: ConvertParams[K]) => void
}

export function PotraceControls({ params, setParam }: PotraceControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <SliderField
        id="threshold"
        label="Threshold"
        min={0}
        max={255}
        step={1}
        value={params.threshold}
        onChange={(v) => setParam("threshold", v)}
      />

      <div className="border-t border-[var(--color-border)] pt-3 mt-1 flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setParam("color", "#000000")
              setParam("background", "#ffffff")
            }}
            className="flex-1 py-1.5 px-3 text-xs font-medium rounded border border-[var(--color-border)] bg-white text-black hover:opacity-80 transition-opacity"
          >
            Dark Path / White BG
          </button>
          <button
            type="button"
            onClick={() => {
              setParam("color", "#ffffff")
              setParam("background", "#000000")
            }}
            className="flex-1 py-1.5 px-3 text-xs font-medium rounded border border-[var(--color-border)] bg-[#000000] text-white hover:opacity-80 transition-opacity"
          >
            White Path / Dark BG
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
            <label htmlFor="background" className="text-xs opacity-60">
              Background
            </label>
            <input
              id="background"
              type="color"
              value={params.background}
              onChange={(e) => setParam("background", e.target.value)}
              className="w-full h-8 rounded border border-[var(--color-border)] cursor-pointer bg-transparent"
            />
          </div>
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
          <div className="flex flex-col gap-3">
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
        </div>
      </details>
    </div>
  )
}
