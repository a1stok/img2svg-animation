import { Slider } from "../../components/ui/slider"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import type { AnimationParams } from "../animator/animation-params"

type AnimationControlsProps = {
  params: AnimationParams
  setParam: <K extends keyof AnimationParams>(key: K, value: AnimationParams[K]) => void
  idPrefix?: string
}

export function AnimationControls({ params, setParam, idPrefix = "anim" }: AnimationControlsProps) {
  const { duration, delay, easing, direction, loop, strokeWidth, fadeInFill } = params

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs opacity-80">
          <Label htmlFor={`${idPrefix}-duration`}>Duration (ms)</Label>
          <span>{duration}</span>
        </div>
        <Slider
          id={`${idPrefix}-duration`}
          min={500}
          max={10000}
          step={100}
          value={[duration]}
          onValueChange={(vals) => setParam("duration", vals[0] as number)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs opacity-80">
          <Label htmlFor={`${idPrefix}-strokeWidth`}>Stroke Width (px)</Label>
          <span>{strokeWidth}</span>
        </div>
        <Slider
          id={`${idPrefix}-strokeWidth`}
          min={1}
          max={10}
          step={1}
          value={[strokeWidth]}
          onValueChange={(vals) => setParam("strokeWidth", vals[0] as number)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs opacity-80">
          <Label htmlFor={`${idPrefix}-delay`}>Path Stagger (ms)</Label>
          <span>{delay}</span>
        </div>
        <Slider
          id={`${idPrefix}-delay`}
          min={0}
          max={5000}
          step={100}
          value={[delay]}
          onValueChange={(vals) => setParam("delay", vals[0] as number)}
        />
        <span className="text-xs text-[var(--color-text-muted)] leading-tight">
          Delays the start of subsequent paths.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-easing`}>Easing</Label>
        <Select value={easing} onValueChange={(v) => setParam("easing", v)}>
          <SelectTrigger id={`${idPrefix}-easing`}>
            <SelectValue placeholder="Select easing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="inOutSine">Ease In Out Sine</SelectItem>
            <SelectItem value="outExpo">Ease Out Expo</SelectItem>
            <SelectItem value="outBounce">Bounce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-direction`}>Direction</Label>
        <Select value={direction} onValueChange={(v) => setParam("direction", v)}>
          <SelectTrigger id={`${idPrefix}-direction`}>
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="reverse">Reverse</SelectItem>
            <SelectItem value="alternate">Alternate (Ping-Pong)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${idPrefix}-loop`} className="cursor-pointer">
            Loop Animation
          </Label>
          <Switch
            id={`${idPrefix}-loop`}
            checked={loop}
            onCheckedChange={(v) => setParam("loop", v)}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${idPrefix}-fadeInFill`} className="cursor-pointer">
            Fade In Fill (after draw)
          </Label>
          <Switch
            id={`${idPrefix}-fadeInFill`}
            checked={fadeInFill}
            onCheckedChange={(v) => setParam("fadeInFill", v)}
          />
        </div>
      </div>
    </div>
  )
}
