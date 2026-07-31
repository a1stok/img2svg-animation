import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Loader,
  Clock,
  Play,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { PotraceControls } from "../potrace/potrace-controls"
import { AnimationControls } from "./animation-controls"
import { appendConvertParamsToFormData } from "../potrace/conversion-options"
import { generateAnimationHtml } from "../animator/animation-params"
import type { BatchItem } from "./types"
import type { ConvertParams } from "../potrace/conversion-options"
import type { AnimationParams } from "../animator/animation-params"
import { toast } from "sonner"

type BatchQueueItemProps = {
  item: BatchItem
  globalTraceParams: ConvertParams
  globalAnimParams: AnimationParams
  onRemove: (id: string) => void
  onSetTraceOverride: (id: string, params: ConvertParams | null) => void
  onSetAnimOverride: (id: string, params: AnimationParams | null) => void
  isProcessing: boolean
}

function StatusBadge({ status }: { status: BatchItem["status"] }) {
  if (status === "pending") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-raised)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
        <Clock className="w-2.5 h-2.5" />
        Pending
      </span>
    )
  }
  if (status === "converting") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/30 animate-pulse">
        <Loader className="w-2.5 h-2.5 animate-spin" />
        Converting
      </span>
    )
  }
  if (status === "done") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
        <CheckCircle className="w-2.5 h-2.5" />
        Done
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/30">
      <AlertCircle className="w-2.5 h-2.5" />
      Error
    </span>
  )
}

export function BatchQueueItem({
  item,
  globalTraceParams,
  globalAnimParams,
  onRemove,
  onSetTraceOverride,
  onSetAnimOverride,
  isProcessing,
}: BatchQueueItemProps) {
  const [expanded, setExpanded] = useState(false)

  // Object URL for thumbnail
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  // On-demand preview state
  const [hasPreviewed, setHasPreviewed] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewSvg, setPreviewSvg] = useState<string | null>(null)
  const [animationUrl, setAnimationUrl] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const effectiveTrace = item.traceOverride ?? globalTraceParams
  const effectiveAnim = item.animOverride ?? globalAnimParams
  const hasOverride = item.traceOverride !== null || item.animOverride !== null

  // Generate thumbnail on mount
  useEffect(() => {
    const url = URL.createObjectURL(item.file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [item.file])

  // If the item finishes batch processing, we can just use its svgResult as the preview
  useEffect(() => {
    if (item.status === "done" && item.svgResult) {
      setPreviewSvg(item.svgResult)
    }
  }, [item.status, item.svgResult])

  // Generate animation HTML when previewSvg or effectiveAnim changes
  const svgDimensions = useRef<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (!previewSvg) {
      setAnimationUrl(null)
      return
    }

    // Extract viewBox dimensions for sizing the preview container robustly
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(previewSvg, "image/svg+xml")
      const svgEl = doc.querySelector("svg")
      let width = 0,
        height = 0

      if (svgEl) {
        const viewBox = svgEl.getAttribute("viewBox")
        if (viewBox) {
          const parts = viewBox.trim().split(/[\s,]+/)
          if (parts.length >= 4) {
            width = parseFloat(parts[2])
            height = parseFloat(parts[3])
          }
        }
        if (!width || !height || isNaN(width) || isNaN(height)) {
          const w = svgEl.getAttribute("width")
          const h = svgEl.getAttribute("height")
          if (w && h) {
            width = parseFloat(w)
            height = parseFloat(h)
          }
        }
      }

      if (width > 0 && height > 0) {
        svgDimensions.current = { width, height }
      } else {
        svgDimensions.current = null
      }
    } catch (e) {
      svgDimensions.current = null
    }

    const html = generateAnimationHtml(previewSvg, effectiveAnim, true) // compact mode
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    setAnimationUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [previewSvg, effectiveAnim])

  // Debounced auto-fetch for trace preview when parameters change (if preview was activated)
  useEffect(() => {
    if (!hasPreviewed) return

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsPreviewing(true)

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const formData = new FormData()
          formData.append("image", item.file)
          appendConvertParamsToFormData(formData, effectiveTrace)

          const response = await fetch("/api/convert", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          })

          const data = (await response.json()) as { svg?: string; error?: string }
          if (!response.ok || !data.svg) {
            throw new Error(data.error ?? "Preview failed")
          }
          setPreviewSvg(data.svg)
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return
          toast.error(err instanceof Error ? err.message : "Failed to preview trace")
        } finally {
          setIsPreviewing(false)
        }
      })()
    }, 150)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [effectiveTrace, hasPreviewed, item.file])

  function handleToggleExpand() {
    if (!expanded && item.traceOverride === null) {
      // Initialize with current global params as the starting point for overrides
      onSetTraceOverride(item.id, { ...globalTraceParams })
      onSetAnimOverride(item.id, { ...globalAnimParams })
    }
    setExpanded((v) => !v)
  }

  function handleClearOverride() {
    onSetTraceOverride(item.id, null)
    onSetAnimOverride(item.id, null)
    setHasPreviewed(false)
    setPreviewSvg(null) // Reset preview since params changed back to global
    setExpanded(false)
  }

  function handlePreviewTrace() {
    setHasPreviewed(true)
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Thumbnail */}
        <div className="w-8 h-8 shrink-0 rounded bg-[var(--color-surface-sunken)] border border-[var(--color-border-light)] overflow-hidden flex items-center justify-center relative">
          {item.status === "done" && item.svgResult ? (
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full object-contain p-0.5"
              dangerouslySetInnerHTML={{ __html: item.svgResult }}
            />
          ) : objectUrl ? (
            <img src={objectUrl} alt={item.file.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-4 h-4 bg-[var(--color-border)] rounded animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium text-[var(--color-text)] truncate"
            title={item.file.name}
          >
            {item.file.name}
          </p>
          {item.errorMessage && (
            <p className="text-xs text-red-400 mt-0.5 truncate">{item.errorMessage}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasOverride && !expanded && (
            <span className="text-[10px] text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-1.5 py-0.5 rounded border border-[var(--color-accent)]/20">
              Custom
            </span>
          )}
          <StatusBadge status={item.status} />

          <button
            onClick={handleToggleExpand}
            disabled={isProcessing}
            className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            title="Override settings for this image"
            aria-label="Toggle per-image settings"
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => onRemove(item.id)}
            disabled={isProcessing}
            className="p-1 rounded text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            title="Remove from queue"
            aria-label="Remove image from queue"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable override panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border)] px-3 py-4 bg-[var(--color-surface-sunken)] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
                  Per-image settings override
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviewTrace}
                    disabled={isPreviewing || isProcessing}
                    className="text-[10px] h-6 px-2.5 flex items-center gap-1.5"
                  >
                    {isPreviewing ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    Preview Trace
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearOverride}
                    className="text-[10px] h-6 px-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    Reset to global
                  </Button>
                </div>
              </div>

              {/* Live Preview Box */}
              <AnimatePresence>
                {previewSvg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="w-full flex flex-col md:flex-row gap-6 mb-2 overflow-hidden"
                  >
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider text-center md:text-left">
                        Original
                      </p>
                      <div className="flex-1 flex items-center justify-center md:justify-start overflow-hidden">
                        {objectUrl && (
                          <img
                            src={objectUrl}
                            alt="Original preview"
                            className="max-w-full max-h-[240px] w-auto h-auto object-contain rounded-lg shadow-sm"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider text-center md:text-left">
                        Animation Preview
                      </p>
                      <div className="flex-1 flex items-center justify-center md:justify-start overflow-hidden relative">
                        {animationUrl ? (
                          <div className="relative inline-block max-w-full max-h-[240px] rounded-lg overflow-hidden shadow-sm [transform:translateZ(0)]">
                            {svgDimensions.current ? (
                              <svg
                                width={svgDimensions.current.width}
                                height={svgDimensions.current.height}
                                viewBox={`0 0 ${svgDimensions.current.width} ${svgDimensions.current.height}`}
                                className="max-w-full max-h-[240px] w-auto h-auto opacity-0 block"
                              />
                            ) : (
                              // Fallback if no viewBox could be parsed
                              <div className="w-[320px] h-[240px] max-w-full" />
                            )}
                            <iframe
                              src={animationUrl}
                              scrolling="no"
                              className="absolute inset-0 w-full h-full border-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                              title="Animation Preview"
                            />
                          </div>
                        ) : (
                          <div
                            className="max-w-full max-h-[240px] [&>svg]:max-w-full [&>svg]:max-h-[240px] [&>svg]:rounded-lg [&>svg]:shadow-sm [&>svg]:bg-white"
                            dangerouslySetInnerHTML={{ __html: previewSvg }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3">
                    Trace Settings
                  </p>
                  <PotraceControls
                    params={effectiveTrace}
                    setParam={(key, value) => {
                      onSetTraceOverride(item.id, {
                        ...effectiveTrace,
                        [key]: value,
                      })
                      if (previewSvg) setPreviewSvg(null) // Clear preview on trace change, forces re-fetch
                    }}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3 xl:mt-0 mt-2">
                    Animation Settings
                  </p>
                  <AnimationControls
                    params={effectiveAnim}
                    setParam={(key, value) => {
                      onSetAnimOverride(item.id, {
                        ...effectiveAnim,
                        [key]: value,
                      })
                      // Note: We don't clear previewSvg here, because the effect will automatically rebuild the animationUrl with new params!
                    }}
                    idPrefix={`item-${item.id}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
