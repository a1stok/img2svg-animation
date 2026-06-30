import type { ConvertParams } from "./types"
import { Slider } from "../../components/ui/slider"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"

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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs opacity-80">
        <Label htmlFor={id}>{label}</Label>
        <span>{value}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0] as number)}
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
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground mt-1">{description}</span>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
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

      <div className="border-t border-[var(--color-border)] pt-3 grid grid-cols-2 gap-3 mt-1">
        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Path Color</Label>
          <input
            id="color"
            type="color"
            value={params.color}
            onChange={(e) => setParam("color", e.target.value)}
            className="w-full h-8 rounded border-none outline-none cursor-pointer bg-transparent"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="background">Background</Label>
          <input
            id="background"
            type="color"
            value={params.background}
            onChange={(e) => setParam("background", e.target.value)}
            className="w-full h-8 rounded border-none outline-none cursor-pointer bg-transparent"
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
