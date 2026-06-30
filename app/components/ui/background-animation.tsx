import { useEffect, useRef } from "react"
import { animate, svg } from "animejs"
import tracedSvgStr from "../../assets/traced-graphic.svg?raw"

export function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const paths = containerRef.current.querySelectorAll("path")
    const svgEl = containerRef.current.querySelector("svg")

    // Remove the background rect so it's transparent
    const rect = containerRef.current.querySelector("rect")
    if (rect) {
      rect.remove()
    }

    if (svgEl) {
      svgEl.classList.add(
        "w-full",
        "h-auto",
        "max-w-6xl",
        "opacity-0",
        "transition-opacity",
        "duration-[2000ms]",
      )
      svgEl.style.maxHeight = "50vh" // Bigger, but still constrained to viewport
    }

    paths.forEach((path) => {
      // White colour (or text color) and transparent fill
      path.setAttribute("stroke", "var(--color-text)")
      path.setAttribute("stroke-width", "2")
      path.setAttribute("fill", "transparent")
    })

    const drawables = Array.from(paths).map((path) => svg.createDrawable(path))

    const animation = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: 10000,
      delay: 0,
      ease: "inOutSine",
      loop: false,
      autoplay: true,
    })

    if (svgEl) {
      requestAnimationFrame(() => {
        svgEl.classList.remove("opacity-0")
        svgEl.classList.add("opacity-30")
      })
    }

    return () => {
      animation.pause()
    }
  }, [])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full flex justify-center items-end pointer-events-none -z-10"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: tracedSvgStr }}
    />
  )
}
