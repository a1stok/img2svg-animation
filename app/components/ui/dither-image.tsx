"use client"

/**
 * `DitherImage` — compound figure that applies a CSS-only Bayer dither effect
 * via the `dither-plugin` Tailwind utility. Adapted for Vite/React Router
 * (uses native `<img>` instead of next/image).
 */
import React, {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
} from "react"
import { cn } from "../../lib/utils"

/** Cell size of the underlying dither matrix */
export type DitherSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const NUMERIC_SIZE_RE = /^\d+$/

const DITHER_SIZE_CLASS: Record<DitherSize, string> = {
  xs: "dither-xs",
  sm: "dither-sm",
  md: "dither-md",
  lg: "dither-lg",
  xl: "dither-xl",
  "2xl": "dither-2xl",
}

export type DitherAspectRatio = "square" | "video" | "portrait" | "wide" | (string & {}) | number

function resolveAspectRatio(ratio: DitherAspectRatio): string {
  if (typeof ratio === "number") return String(ratio)
  if (ratio === "square") return "1 / 1"
  if (ratio === "video") return "16 / 9"
  if (ratio === "portrait") return "3 / 4"
  if (ratio === "wide") return "21 / 9"
  return ratio
}

interface DitherVars {
  "--dither-gray"?: number | string
  "--dither-contrast"?: number | string
  "--dither-bright"?: number | string
  "--dither-blur"?: string
  "--dither-cell"?: string
  "--dither-opacity"?: number | string
  "--dither-image"?: string
}

const DitherImageFrameContext = createContext<{ invertOnDark: boolean } | null>(null)

/* ─── Root figure ──────────────────────────────────────────────────────── */

export type DitherImageProps = ComponentProps<"figure">

const DitherImage = forwardRef<HTMLElement, DitherImageProps>(function DitherImage(
  { className, ...props },
  ref,
) {
  return (
    <figure
      className={cn("inline-flex flex-col gap-3", className)}
      data-slot="dither-image"
      ref={ref}
      {...props}
    />
  )
})
DitherImage.displayName = "DitherImage"

/* ─── Frame (the dither surface) ───────────────────────────────────────── */

export interface DitherImageFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  size?: DitherSize
  aspectRatio?: DitherAspectRatio
  grayscale?: number
  contrast?: number
  brightness?: number
  blur?: number | string
  opacity?: number
  rounded?: boolean | string
  invertOnDark?: boolean
  style?: CSSProperties & DitherVars
}

const DitherImageFrame = forwardRef<HTMLDivElement, DitherImageFrameProps>(
  function DitherImageFrame(
    {
      className,
      size = "lg",
      aspectRatio,
      grayscale,
      contrast,
      brightness,
      blur,
      opacity,
      rounded = true,
      invertOnDark = false,
      style,
      ...props
    },
    ref,
  ) {
    const vars: CSSProperties & DitherVars = { ...style }

    if (grayscale !== undefined) vars["--dither-gray"] = grayscale
    if (contrast !== undefined) vars["--dither-contrast"] = contrast
    if (brightness !== undefined) vars["--dither-bright"] = brightness
    if (blur !== undefined) vars["--dither-blur"] = typeof blur === "number" ? `${blur}px` : blur
    if (opacity !== undefined) vars["--dither-opacity"] = opacity
    if (aspectRatio !== undefined && vars.aspectRatio === undefined) {
      vars.aspectRatio = resolveAspectRatio(aspectRatio)
    }

    let roundedClass: string | undefined
    if (rounded === true) roundedClass = "rounded-xl"
    else if (typeof rounded === "string") roundedClass = rounded

    const frame = (
      <div
        className={cn(DITHER_SIZE_CLASS[size], "relative block w-full", roundedClass, className)}
        data-size={size}
        data-slot="dither-image-frame"
        ref={ref}
        style={vars}
        {...props}
      />
    )

    return (
      <DitherImageFrameContext.Provider value={{ invertOnDark }}>
        {invertOnDark ? <div className="dark:invert">{frame}</div> : frame}
      </DitherImageFrameContext.Provider>
    )
  },
)
DitherImageFrame.displayName = "DitherImageFrame"

/* ─── Reveal stage ─────────────────────────────────────────────────────── */

export type DitherImageRevealProps = ComponentProps<"div"> & {
  size?: number | string
}

const DitherImageReveal = forwardRef<HTMLDivElement, DitherImageRevealProps>(
  function DitherImageReveal({ className, size, ...props }, ref) {
    let sizeClass: string | undefined
    if (size !== undefined) {
      sizeClass =
        typeof size === "number" || NUMERIC_SIZE_RE.test(String(size))
          ? `size-${size}`
          : String(size)
    }

    return (
      <div
        className={cn("relative overflow-hidden", sizeClass, className)}
        data-slot="dither-image-reveal"
        ref={ref}
        {...props}
      />
    )
  },
)
DitherImageReveal.displayName = "DitherImageReveal"

/* ─── Image content (native img instead of next/image) ─────────────────── */

export interface DitherImageContentProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

const DitherImageContent = forwardRef<HTMLImageElement, DitherImageContentProps>(
  function DitherImageContent({ className, alt, ...props }, ref) {
    const ctx = useContext(DitherImageFrameContext)
    const counterInvert = ctx?.invertOnDark === true ? "dark:invert" : undefined

    return (
      <img
        alt={alt}
        className={cn("block h-full w-full object-cover", counterInvert, className)}
        data-slot="dither-image-content"
        ref={ref}
        {...props}
      />
    )
  },
)
DitherImageContent.displayName = "DitherImageContent"

/* ─── Caption ──────────────────────────────────────────────────────────── */

export type DitherImageCaptionProps = ComponentProps<"figcaption">

const DitherImageCaption = forwardRef<HTMLElement, DitherImageCaptionProps>(
  function DitherImageCaption({ className, ...props }, ref) {
    return (
      <figcaption
        className={cn("text-pretty text-muted-foreground text-sm leading-relaxed", className)}
        data-slot="dither-image-caption"
        ref={ref}
        {...props}
      />
    )
  },
)
DitherImageCaption.displayName = "DitherImageCaption"

export { DitherImage, DitherImageCaption, DitherImageContent, DitherImageFrame, DitherImageReveal }
