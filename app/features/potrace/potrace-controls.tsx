import type { ConvertParams, TurnPolicy } from "./types"

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

const TURN_POLICY_OPTIONS: { value: TurnPolicy; label: string }[] = [
  { value: "minority", label: "Minority" },
  { value: "majority", label: "Majority" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
]

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
            Background is just to preview how it fits your site; it won't be drawn in the animation.
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
    </div>
  )
}
