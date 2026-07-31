import { useState, useMemo, useRef, useEffect } from "react"
import { Slider } from "../../components/ui/slider"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { animate, svg, stagger } from "animejs"
import { toast } from "sonner"
import { Copy } from "lucide-react"
import {
  type AnimationParams,
  defaultAnimationParams,
  generateAnimationHtml,
} from "./animation-params"

export type SvgPlayerProps = {
  svgString: string
}

export function SvgPlayer({ svgString }: SvgPlayerProps) {
  const [duration, setDuration] = useState(defaultAnimationParams.duration)
  const [delay, setDelay] = useState(defaultAnimationParams.delay)
  const [easing, setEasing] = useState(defaultAnimationParams.easing)
  const [direction, setDirection] = useState(defaultAnimationParams.direction)
  const [loop, setLoop] = useState(defaultAnimationParams.loop)
  const [strokeWidth, setStrokeWidth] = useState(defaultAnimationParams.strokeWidth)
  const [fadeInFill, setFadeInFill] = useState(defaultAnimationParams.fadeInFill)

  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<any>(null)
  const lastDelayedSvgRef = useRef<string | null>(null)

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
      const fill = path.getAttribute("fill") || "#000000"
      path.setAttribute("stroke", fill)
      path.style.strokeWidth = `${strokeWidth}px`
      if (fadeInFill) {
        path.style.fill = fill
        path.style.fillOpacity = "0"
      } else {
        path.style.fill = "transparent"
        path.style.fillOpacity = "1"
      }
    })

    const drawables = svg.createDrawable(paths)

    const isNewSvg = lastDelayedSvgRef.current !== svgString
    if (isNewSvg) {
      lastDelayedSvgRef.current = svgString
    }

    animationRef.current = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: duration,
      delay: delay > 0 ? stagger(delay) : 0,
      ease: easing,
      alternate: direction === "alternate",
      reversed: direction === "reverse",
      loop: loop,
      autoplay: !isNewSvg,
    })

    if (direction === "reverse") {
      animationRef.current.reverse()
    }

    let fillAnimation: any = null
    if (fadeInFill) {
      fillAnimation = animate(paths, {
        fillOpacity: [0, 1],
        duration: 1000,
        delay: duration + paths.length * delay,
        ease: "linear",
        loop: loop,
        autoplay: !isNewSvg,
      })
    }

    let timerId: ReturnType<typeof setTimeout>
    if (isNewSvg) {
      // Delay the initial playback to allow the layout enter animations (0.7s) to finish
      timerId = setTimeout(() => {
        animationRef.current?.play()
        if (fillAnimation) fillAnimation.play()
      }, 800)
    }

    return () => {
      if (timerId) clearTimeout(timerId)
      if (animationRef.current) animationRef.current.pause()
      if (fillAnimation) fillAnimation.pause()
    }
  }, [svgString, duration, delay, easing, direction, loop, strokeWidth, fadeInFill])

  function handlePlay() {
    animationRef.current?.play()
  }

  function handlePause() {
    animationRef.current?.pause()
  }

  function handleRestart() {
    animationRef.current?.restart()
  }

  // Generate the Anime.js V4 code snippet for the Integration Guide panel
  const generatedCSS = `/* --- Required CSS --- */
.svg-container path {
  ${fadeInFill ? "fill-opacity: 0;" : "fill: transparent;"}
  stroke-width: ${strokeWidth}px;
}`

  const generatedJS = `/* --- Animation code --- */
import { animate, svg, stagger } from "animejs";

// Extracted ${pathCount} paths from the uploaded image
const paths = document.querySelectorAll(".svg-container path");

// Copy the path's fill color to its stroke color
paths.forEach(path => {
  const fill = path.getAttribute("fill") || "#000000";
  path.setAttribute("stroke", fill);
  ${fadeInFill ? `path.setAttribute("fill", fill);\n  path.style.fillOpacity = "0";` : `// Fill hidden via CSS`}
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
${
  fadeInFill
    ? `
// Fade in original fill opacity after drawing completes
animate(paths, {
  fillOpacity: [0, 1],
  duration: 1000,
  delay: ${duration} + ${delay > 0 ? `(${pathCount} * ${delay})` : 0},
  ease: "linear",
  loop: ${loop},
  autoplay: true,
});
`
    : ""
}${direction === "reverse" ? `\nanimation.reverse();` : ""}`.trim()

  const displayCode = `${generatedCSS}\n\n${generatedJS}`

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
    const params: AnimationParams = {
      duration,
      delay,
      easing,
      direction,
      loop,
      strokeWidth,
      fadeInFill,
    }
    const htmlContent = generateAnimationHtml(svgString, params)
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "animation.html"
    a.click()
    URL.revokeObjectURL(url)
  }

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
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* Controls Panel */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Animation Settings</h3>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs opacity-80">
                <Label htmlFor="duration">Duration (ms)</Label>
                <span>{duration}</span>
              </div>
              <Slider
                id="duration"
                min={500}
                max={10000}
                step={100}
                value={[duration]}
                onValueChange={(vals) => setDuration(vals[0] as number)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs opacity-80">
                <Label htmlFor="strokeWidth">Stroke Width (px)</Label>
                <span>{strokeWidth}</span>
              </div>
              <Slider
                id="strokeWidth"
                min={1}
                max={10}
                step={1}
                value={[strokeWidth]}
                onValueChange={(vals) => setStrokeWidth(vals[0] as number)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs opacity-80">
                <Label htmlFor="delay">Path Stagger (ms)</Label>
                <span>{delay}</span>
              </div>
              <Slider
                id="delay"
                min={0}
                max={5000}
                step={100}
                value={[delay]}
                onValueChange={(vals) => setDelay(vals[0] as number)}
              />
              <span className="text-xs text-muted-foreground mt-1 leading-tight">
                Delays the start of subsequent paths. Noticeable only on images with multiple paths.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="easing">Easing</Label>
              <Select value={easing} onValueChange={setEasing}>
                <SelectTrigger id="easing">
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
              <Label htmlFor="direction">Direction</Label>
              <Select value={direction} onValueChange={setDirection}>
                <SelectTrigger id="direction">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="reverse">Reverse</SelectItem>
                  <SelectItem value="alternate">Alternate (Ping-Pong)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="loop-anim" className="cursor-pointer">
                  Loop Animation
                </Label>
                <Switch id="loop-anim" checked={loop} onCheckedChange={setLoop} />
              </div>
              <div className="flex items-center justify-between gap-4 mt-2">
                <Label htmlFor="fade-in-fill" className="cursor-pointer">
                  Fade In Fill (after draw)
                </Label>
                <Switch id="fade-in-fill" checked={fadeInFill} onCheckedChange={setFadeInFill} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold opacity-80 uppercase tracking-wider">
              Playback Controls
            </h3>
            <div className="flex gap-2">
              <Button onClick={handlePlay}>Play</Button>
              <Button variant="secondary" onClick={handlePause}>
                Pause
              </Button>
              <Button variant="secondary" onClick={handleRestart}>
                Restart
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold opacity-80 uppercase tracking-wider">
              Export Options
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={handleCopySVG}>
                Copy SVG
              </Button>
              <Button variant="outline" onClick={handleDownloadSVG}>
                Download SVG
              </Button>
              <Button onClick={handleDownloadAnimation}>Download Animation (HTML)</Button>
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Integration Guide</h3>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-[var(--color-text)] bg-[var(--color-surface-raised)] p-5 rounded-lg border border-white/5">
            <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--color-text)] opacity-80 mb-1">
              How to use this code:
            </h4>
            <ol className="list-decimal list-outside ml-4 flex flex-col gap-3 opacity-90">
              <li>
                <strong>Install Anime.js (V4):</strong> Run{" "}
                <code className="bg-black/30 text-[var(--color-text)] px-1.5 py-0.5 rounded text-xs">
                  npm install animejs
                </code>
              </li>
              <li>
                <strong>Add the SVG:</strong> Click "Copy SVG", paste it into your HTML, and wrap it
                in a{" "}
                <code className="bg-black/30 text-[var(--color-text)] px-1.5 py-0.5 rounded text-xs">
                  &lt;div class="svg-container"&gt;
                </code>
                .
              </li>
              <li>
                <strong>Customize & Apply:</strong> The code below updates automatically. Copy and
                add the CSS and JS to your project.
              </li>
            </ol>
          </div>

          <div className="relative h-full flex-1 flex flex-col mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] border-white/10"
              onClick={() => {
                navigator.clipboard.writeText(displayCode)
                toast.success("Animation code copied!")
              }}
              title="Copy Animation Code"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <pre className="p-4 pt-10 bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-lg overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-xs h-full flex-1">
              <code>{displayCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
