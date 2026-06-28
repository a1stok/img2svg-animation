import { useEffect, useRef } from "react"
import anime from "animejs"

type SvgPlayerProps = {
  svgString: string
}

// Parses the SVG string, mounts it, and animates each path using Anime.js stroke drawing.
export function SvgPlayer({ svgString }: SvgPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = svgString

    const paths = containerRef.current.querySelectorAll("path")

    paths.forEach((path) => {
      path.style.fill = "none"
      path.style.stroke = "var(--color-accent)"
      path.style.strokeWidth = "1.5"
    })

    anime({
      targets: Array.from(paths),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 2000,
      delay: (_el: Element, i: number) => i * 80,
      loop: false,
    })
  }, [svgString])

  return <div ref={containerRef} className="w-full max-w-xl" />
}
