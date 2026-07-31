import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Download, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { PotraceControls } from "../potrace/potrace-controls"
import { AnimationControls } from "./animation-controls"
import { BatchUploader } from "./batch-uploader"
import { BatchQueueItem } from "./batch-queue-item"
import type { UseBatchConversionReturn } from "./use-batch-conversion"

const WARN_BATCH_SIZE = 50

type BatchManagerProps = {
  batch: UseBatchConversionReturn
}

export function BatchManager({ batch }: BatchManagerProps) {
  const {
    queue,
    globalTraceParams,
    setGlobalTraceParam,
    globalAnimParams,
    setGlobalAnimParam,
    addFiles,
    removeItem,
    setItemTraceOverride,
    setItemAnimOverride,
    processAll,
    isProcessing,
    progress,
    clearQueue,
  } = batch

  const pendingCount = queue.filter((i) => i.status === "pending" || i.status === "error").length
  const doneCount = queue.filter((i) => i.status === "done").length
  const hasQueue = queue.length > 0
  const showWarning = queue.length > WARN_BATCH_SIZE

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Uploader — full-width, matching single-mode card */}
      <BatchUploader onFilesSelected={addFiles} disabled={isProcessing} />

      {/* Large batch warning */}
      {showWarning && (
        <div className="flex items-start gap-2 bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3 text-amber-300 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            <strong>{queue.length} images</strong> queued. Large batches may be slow in the browser.
          </span>
        </div>
      )}

      {/* Queue + Global Settings — revealed once files are added */}
      {hasQueue && (
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Queue list ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Queue
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {queue.length} image{queue.length !== 1 ? "s" : ""}
                  {doneCount > 0 && <span className="text-emerald-400"> · {doneCount} done</span>}
                </p>
              </div>
              <button
                onClick={clearQueue}
                disabled={isProcessing}
                className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Clear all"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            </div>

            {/* Progress bar — shown during processing */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-accent)]">Converting…</span>
                    <span>
                      {progress.done} / {progress.total}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[var(--color-surface-raised)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--color-accent)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          progress.total > 0 ? `${(progress.done / progress.total) * 100}%` : "0%",
                      }}
                      transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Queue items */}
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {queue.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <BatchQueueItem
                      item={item}
                      globalTraceParams={globalTraceParams}
                      globalAnimParams={globalAnimParams}
                      onRemove={removeItem}
                      onSetTraceOverride={setItemTraceOverride}
                      onSetAnimOverride={setItemAnimOverride}
                      isProcessing={isProcessing}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={processAll}
                disabled={isProcessing || pendingCount === 0}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing
                  ? `Processing ${progress.done} / ${progress.total}…`
                  : "Process All & Download ZIP"}
              </Button>
              {!isProcessing && (
                <Button
                  variant="secondary"
                  onClick={clearQueue}
                  className="text-[var(--color-text-muted)]"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* ── Global settings sidebar ── */}
          <div className="lg:w-72 xl:w-80 shrink-0 flex flex-col gap-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            {/* Sidebar header */}
            <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              <h2 className="text-sm font-semibold">Global Settings</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Applied to all images unless overridden per-image.
              </p>
            </div>

            <div className="px-4 py-4 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-280px)]">
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                  Trace
                </p>
                <PotraceControls params={globalTraceParams} setParam={setGlobalTraceParam} />
              </div>

              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                  Animation
                </p>
                <AnimationControls
                  params={globalAnimParams}
                  setParam={setGlobalAnimParam}
                  idPrefix="global"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
