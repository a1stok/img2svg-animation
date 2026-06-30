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
      const fill = path.getAttribute("fill") || "currentColor"
      path.setAttribute("stroke", fill)
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

    let timerId: ReturnType<typeof setTimeout>
    if (isNewSvg) {
      // Delay the initial playback to allow the layout enter animations (0.7s) to finish
      timerId = setTimeout(() => {
        animationRef.current?.play()
      }, 800)
    }

    return () => {
      if (timerId) clearTimeout(timerId)
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
        <div className="w-full md:w-1/2 flex flex-col gap-6">
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

            <div className="flex items-center justify-between gap-4 mt-2">
              <Label htmlFor="loop-anim" className="cursor-pointer">
                Loop Animation
              </Label>
              <Switch id="loop-anim" checked={loop} onCheckedChange={setLoop} />
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
          <h3 className="text-lg font-semibold">Generated Config (Anime.js V4)</h3>
          <pre className="p-4 bg-[var(--color-surface-raised)] text-[var(--color-text)] rounded-lg overflow-x-auto text-xs h-full">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
