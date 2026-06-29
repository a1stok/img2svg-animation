import { useState, useMemo, useRef, useEffect } from "react"
import { animate, svg, stagger } from "animejs"

export type SvgPlayerProps = {
  svgString: string
}

export function SvgPlayer({ svgString }: SvgPlayerProps) {
  const [animationMode, setAnimationMode] = useState<"line" | "tracer">("line")
  const [duration, setDuration] = useState(2000)
  const [delay, setDelay] = useState(0)
  const [easing, setEasing] = useState("inOutSine")
  const [direction, setDirection] = useState("normal")
  const [loop, setLoop] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<any>(null)

  // Parse the SVG string to extract path information and colors
  const parsedPaths = useMemo(() => {
    if (!svgString) return []
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgString, "image/svg+xml")
      return Array.from(doc.querySelectorAll("path")).map((p) => ({
        fill: p.getAttribute("fill") || "currentColor",
      }))
    } catch {
      return []
    }
  }, [svgString])

  const pathCount = parsedPaths.length

  useEffect(() => {
    if (!containerRef.current || !svgString) return

    if (animationRef.current) {
      if (Array.isArray(animationRef.current)) {
        animationRef.current.forEach((a: any) => a.pause())
      } else if (animationRef.current.pause) {
        animationRef.current.pause()
      }
    }

    const paths = containerRef.current.querySelectorAll("path")
    if (paths.length === 0) return

    if (animationMode === "tracer") {
      // Tracer mode
      const dots = containerRef.current.closest(".svg-container")?.querySelectorAll(".tracer-dot")
      paths.forEach((path) => {
        path.setAttribute("stroke-opacity", "0.2")
        const fill = path.getAttribute("fill") || "currentColor"
        path.setAttribute("stroke", fill)
        // ensure draw is 1 so path is visible
        path.style.strokeDashoffset = "0"
      })

      if (!dots || dots.length === 0) return

      const animations = Array.from(paths)
        .map((path, index) => {
          const dot = dots[index]
          if (!dot) return null

          const anim = animate(dot, {
            ...svg.createMotionPath(path as SVGPathElement),
            duration: duration,
            delay: delay > 0 ? index * delay : 0,
            ease: easing,
            alternate: direction === "alternate",
            loop: loop,
            autoplay: true,
          })
          if (direction === "reverse") {
            anim.reverse()
          }
          return anim
        })
        .filter(Boolean)

      animationRef.current = animations
    } else {
      // Line drawing mode
      paths.forEach((path) => {
        path.removeAttribute("stroke-opacity")
        const fill = path.getAttribute("fill") || "currentColor"
        path.setAttribute("stroke", fill)
      })

      const drawables = Array.from(paths).map((path) => svg.createDrawable(path as SVGPathElement))

      const anim = animate(drawables, {
        draw: ["0 0", "0 1"],
        duration: duration,
        delay: delay > 0 ? stagger(delay) : 0,
        ease: easing,
        alternate: direction === "alternate",
        loop: loop,
        autoplay: true,
      })

      if (direction === "reverse") {
        anim.reverse()
      }
      animationRef.current = anim
    }

    return () => {
      if (animationRef.current) {
        if (Array.isArray(animationRef.current)) {
          animationRef.current.forEach((a: any) => a.pause())
        } else if (animationRef.current.pause) {
          animationRef.current.pause()
        }
      }
    }
  }, [svgString, duration, delay, easing, direction, loop, animationMode])

  function handlePlay() {
    if (Array.isArray(animationRef.current)) {
      animationRef.current.forEach((a: any) => a.play())
    } else {
      animationRef.current?.play()
    }
  }

  function handlePause() {
    if (Array.isArray(animationRef.current)) {
      animationRef.current.forEach((a: any) => a.pause())
    } else {
      animationRef.current?.pause()
    }
  }

  function handleRestart() {
    if (Array.isArray(animationRef.current)) {
      animationRef.current.forEach((a: any) => a.restart())
    } else {
      animationRef.current?.restart()
    }
  }

  // Generate the Anime.js V4 executable code snippet
  const generatedCode =
    animationMode === "line"
      ? `
import { animate, svg, stagger } from "animejs";

// Extracted ${pathCount} paths from the uploaded image
const paths = document.querySelectorAll(".svg-container path");

// For line drawing, Anime.js animates the stroke. 
// We copy the path's fill color to its stroke color, 
// and in CSS we set the fill to transparent.
paths.forEach(path => {
  const fill = path.getAttribute("fill") || "currentColor";
  path.setAttribute("stroke", fill);
});

const drawables = Array.from(paths).map(path => svg.createDrawable(path));

// Initialize line drawing animation
const animation = animate(drawables, {
  draw: ['0 0', '0 1'],
  duration: ${duration},
  delay: ${delay > 0 ? `stagger(${delay})` : 0},
  ease: "${easing}",${direction === "alternate" ? `\n  alternate: true,` : ""}
  loop: ${loop},
  autoplay: true,
});
${direction === "reverse" ? `\nanimation.reverse();` : ""}
`.trim()
      : `
import { animate, svg } from "animejs";

// Extracted ${pathCount} paths from the uploaded image
const paths = document.querySelectorAll(".svg-container path");
const dots = document.querySelectorAll(".tracer-dot");

paths.forEach(path => {
  path.setAttribute("stroke-opacity", "0.2");
  const fill = path.getAttribute("fill") || "currentColor";
  path.setAttribute("stroke", fill);
});

const animations = Array.from(paths).map((path, index) => {
  const dot = dots[index];
  if (!dot) return null;

  const anim = animate(dot, {
    ...svg.createMotionPath(path),
    duration: ${duration},
    delay: ${delay > 0 ? `index * ${delay}` : 0},
    ease: "${easing}",${direction === "alternate" ? `\n    alternate: true,` : ""}
    loop: ${loop},
    autoplay: true,
  });
  ${direction === "reverse" ? `\n  anim.reverse();` : ""}
  return anim;
});
`.trim()

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="w-full flex flex-col gap-2 items-center">
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest text-center">
          Animation Preview
        </p>
        <div className="w-full h-full p-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/30 rounded-lg border border-[var(--color-border)]">
          <div className="relative w-full max-w-md svg-container">
            <div
              ref={containerRef}
              className="w-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:shadow-xl [&>svg]:bg-transparent [&_path]:fill-transparent [&_path]:stroke-[1px]"
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
            {animationMode === "tracer" &&
              parsedPaths.map((path, i) => (
                <div
                  key={i}
                  className="tracer-dot absolute top-0 left-0 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ backgroundColor: path.fill, color: path.fill }}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* Controls Panel */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Animation Settings</h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs opacity-60">Animation Mode</label>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-[var(--color-border)]">
                <button
                  onClick={() => setAnimationMode("line")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${animationMode === "line" ? "bg-white dark:bg-zinc-700 shadow-sm font-medium" : "opacity-70 hover:opacity-100"}`}
                >
                  Line Drawing
                </button>
                <button
                  onClick={() => setAnimationMode("tracer")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${animationMode === "tracer" ? "bg-white dark:bg-zinc-700 shadow-sm font-medium" : "opacity-70 hover:opacity-100"}`}
                >
                  Tracer
                </button>
              </div>
            </div>

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
                <label htmlFor="delay">Path Stagger (ms)</label>
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
              <span className="text-[10px] opacity-40 leading-tight">
                Delays the start of subsequent paths. Noticeable only on images with multiple paths.
              </span>
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
                <option value="inOutSine">Ease In Out Sine</option>
                <option value="outExpo">Ease Out Expo</option>
                <option value="outBounce">Bounce</option>
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

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold opacity-80 uppercase tracking-wider">
              Playback Controls
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Play
              </button>
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Pause
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Restart
              </button>
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Generated Config (Anime.js V4)</h3>
          <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-lg overflow-x-auto text-xs h-full">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
