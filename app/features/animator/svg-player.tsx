import { useState } from "react"

export type SvgPlayerProps = {
  svgString: string
}

export function SvgPlayer({ svgString }: SvgPlayerProps) {
  const [duration, setDuration] = useState(2000)
  const [delay, setDelay] = useState(0)
  const [easing, setEasing] = useState("easeInOutSine")
  const [direction, setDirection] = useState("normal")
  const [loop, setLoop] = useState(false)

  const config = {
    svgLength: svgString.length,
    duration,
    delay,
    easing,
    direction,
    loop,
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* Controls Panel */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Animation Settings</h3>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs opacity-60">
            <label htmlFor="duration">Duration (ms)</label>
            <span>{duration}</span>
          </div>
          <input
            id="duration"
            type="range"
            min={500}
            max={10000}
            step={100}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs opacity-60">
            <label htmlFor="delay">Delay (ms)</label>
            <span>{delay}</span>
          </div>
          <input
            id="delay"
            type="range"
            min={0}
            max={5000}
            step={100}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="easing" className="text-xs opacity-60">
            Easing
          </label>
          <select
            id="easing"
            value={easing}
            onChange={(e) => setEasing(e.target.value)}
            className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 border border-[var(--color-border)] text-sm"
          >
            <option value="linear">Linear</option>
            <option value="easeInOutSine">Ease In Out Sine</option>
            <option value="easeOutExpo">Ease Out Expo</option>
            <option value="spring(1, 80, 10, 0)">Spring</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="direction" className="text-xs opacity-60">
            Direction
          </label>
          <select
            id="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 border border-[var(--color-border)] text-sm"
          >
            <option value="normal">Normal</option>
            <option value="reverse">Reverse</option>
            <option value="alternate">Alternate (Ping-Pong)</option>
          </select>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none mt-2">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm">Loop Animation</span>
        </label>
      </div>

      {/* JSON Output */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Generated Config</h3>
        <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-lg overflow-x-auto text-xs h-full">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  )
}
