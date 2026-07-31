import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Loader, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { PotraceControls } from "../potrace/potrace-controls"
import { AnimationControls } from "./animation-controls"
import type { BatchItem } from "./types"
import type { ConvertParams } from "../potrace/conversion-options"
import type { AnimationParams } from "../animator/animation-params"

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

  const effectiveTrace = item.traceOverride ?? globalTraceParams
  const effectiveAnim = item.animOverride ?? globalAnimParams
  const hasOverride = item.traceOverride !== null || item.animOverride !== null

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
    setExpanded(false)
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearOverride}
                  className="text-[10px] h-6 px-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Reset to global
                </Button>
              </div>

              <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3">
                  Trace Settings
                </p>
                <PotraceControls
                  params={effectiveTrace}
                  setParam={(key, value) =>
                    onSetTraceOverride(item.id, {
                      ...effectiveTrace,
                      [key]: value,
                    })
                  }
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3">
                  Animation Settings
                </p>
                <AnimationControls
                  params={effectiveAnim}
                  setParam={(key, value) =>
                    onSetAnimOverride(item.id, {
                      ...effectiveAnim,
                      [key]: value,
                    })
                  }
                  idPrefix={`item-${item.id}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
