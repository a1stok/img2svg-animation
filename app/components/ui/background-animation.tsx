import { useEffect, useRef, useState } from "react"
import { animate, svg } from "animejs"
import tracedSvgStr from "../../assets/traced-graphic.svg?raw"

export function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const paths = containerRef.current.querySelectorAll("path")
    if (paths.length === 0) return

    const drawables = svg.createDrawable(paths)

    const animation = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: 15000,
      ease: "inOutSine",
      loop: false,
      autoplay: true,
    })

    return () => {
      animation.pause()
    }
  }, [])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full flex justify-center items-end pointer-events-none -z-10 [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-6xl [&>svg]:max-h-[50vh] [&>svg]:opacity-30 [&_rect]:hidden [&_path]:fill-transparent [&_path]:stroke-[var(--color-text)] [&_path]:stroke-[2px]"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: tracedSvgStr }}
    />
  )
}
