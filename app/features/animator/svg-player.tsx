import { useState, useMemo, useRef, useEffect } from "react"
import { animate, svg, stagger } from "animejs"
import { toast } from "sonner"

export type SvgPlayerProps = {
  svgString: string
}

export function SvgPlayer({ svgString }: SvgPlayerProps) {
  const [duration, setDuration] = useState(2000)
  const [delay, setDelay] = useState(0)
  const [easing, setEasing] = useState("inOutSine")
  const [direction, setDirection] = useState("normal")
  const [loop, setLoop] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<any>(null)

  // Parse the SVG string to extract path information
  const pathCount = useMemo(() => {
    if (!svgString) return 0
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgString, "image/svg+xml")
      return doc.querySelectorAll("path").length
    } catch {
      return 0
    }
  }, [svgString])

  useEffect(() => {
    if (!containerRef.current || !svgString) return

    if (animationRef.current) {
      animationRef.current.pause()
    }

    const paths = containerRef.current.querySelectorAll("path")
    if (paths.length === 0) return

    paths.forEach((path) => {
      const fill = path.getAttribute("fill") || "currentColor"
      path.setAttribute("stroke", fill)
    })

    const drawables = Array.from(paths).map((path) => svg.createDrawable(path as SVGPathElement))

    animationRef.current = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: duration,
      delay: delay > 0 ? stagger(delay) : 0,
      ease: easing,
      alternate: direction === "alternate",
      loop: loop,
      autoplay: true,
    })

    const svgEl = containerRef.current.querySelector("svg")
    if (svgEl) {
      requestAnimationFrame(() => {
        svgEl.style.opacity = "1"
      })
    }

    if (direction === "reverse") {
      animationRef.current.reverse()
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause()
      }
    }
  }, [svgString, duration, delay, easing, direction, loop])

  function handlePlay() {
    animationRef.current?.play()
  }

  function handlePause() {
    animationRef.current?.pause()
  }

  function handleRestart() {
    animationRef.current?.restart()
  }

  // Generate the Anime.js V4 executable code snippet
  const generatedCode = `
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

  function handleCopySVG() {
    navigator.clipboard.writeText(svgString)
    toast.success("SVG copied to clipboard!")
  }

  function handleDownloadSVG() {
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "traced-graphic.svg"
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleDownloadAnimation() {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG Animation</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #05070a;
    }
    .svg-container {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
    }
    .svg-container svg {
      width: 100%;
      height: auto;
    }
    .svg-container path {
      fill: transparent;
      stroke-width: 1px;
    }
  </style>
</head>
<body>
  <div class="svg-container">
    ${svgString}
  </div>

  <script type="module">
${generatedCode.replace(/from "animejs";?/, 'from "https://esm.sh/animejs@4.5.0";')}
  </script>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "animation.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const processedSvgString = useMemo(() => {
    return svgString.replace("<svg", '<svg style="opacity: 0; transition: opacity 0.3s ease-in;"')
  }, [svgString])

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="w-full flex flex-col gap-2 items-center">
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest text-center">
          Animation Preview
        </p>
        <div className="w-full h-full flex items-center justify-center">
          <div
            ref={containerRef}
            className="w-full max-w-md [&>svg]:w-full [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:shadow-xl [&>svg]:bg-white [&>svg]:p-8 [&_path]:fill-transparent [&_path]:stroke-[1px]"
            dangerouslySetInnerHTML={{ __html: processedSvgString }}
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* Controls Panel */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
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
                className="w-full accent-[var(--color-accent)] border-none outline-none bg-transparent"
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
                className="w-full accent-[var(--color-accent)] border-none outline-none bg-transparent"
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
                className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm"
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
                className="p-2 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-sm"
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
                className="px-4 py-2 bg-[var(--color-surface-raised)] rounded font-medium text-sm hover:border-[var(--color-border-light)] border border-transparent transition-colors"
              >
                Pause
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-[var(--color-surface-raised)] rounded font-medium text-sm hover:border-[var(--color-border-light)] border border-transparent transition-colors"
              >
                Restart
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold opacity-80 uppercase tracking-wider">
              Export Options
            </h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCopySVG}
                className="px-4 py-2 bg-[var(--color-surface-raised)] rounded font-medium text-sm hover:border-[var(--color-border-light)] border border-transparent transition-colors"
              >
                Copy SVG
              </button>
              <button
                onClick={handleDownloadSVG}
                className="px-4 py-2 bg-[var(--color-surface-raised)] rounded font-medium text-sm hover:border-[var(--color-border-light)] border border-transparent transition-colors"
              >
                Download SVG
              </button>
              <button
                onClick={handleDownloadAnimation}
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent)]/20"
              >
                Download Animation (HTML)
              </button>
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Generated Config (Anime.js V4)</h3>
          <pre className="p-4 bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-lg overflow-x-auto text-xs h-full">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
