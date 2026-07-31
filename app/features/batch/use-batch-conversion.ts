import { useState, useCallback } from "react"
import JSZip from "jszip"
import { toast } from "sonner"
import { defaultParams, appendConvertParamsToFormData } from "../potrace/conversion-options"
import type { ConvertParams } from "../potrace/conversion-options"
import { defaultAnimationParams, generateAnimationHtml } from "../animator/animation-params"
import type { AnimationParams } from "../animator/animation-params"
import type { BatchItem } from "./types"

const MAX_BATCH_SIZE = 100
const WARN_BATCH_SIZE = 50

export type UseBatchConversionReturn = {
  queue: BatchItem[]
  globalTraceParams: ConvertParams
  setGlobalTraceParam: <K extends keyof ConvertParams>(key: K, value: ConvertParams[K]) => void
  globalAnimParams: AnimationParams
  setGlobalAnimParam: <K extends keyof AnimationParams>(key: K, value: AnimationParams[K]) => void
  addFiles: (files: File[]) => void
  removeItem: (id: string) => void
  setItemTraceOverride: (id: string, params: ConvertParams | null) => void
  setItemAnimOverride: (id: string, params: AnimationParams | null) => void
  processAll: () => Promise<void>
  isProcessing: boolean
  progress: { done: number; total: number }
  clearQueue: () => void
}

export function useBatchConversion(): UseBatchConversionReturn {
  const [queue, setQueue] = useState<BatchItem[]>([])
  const [globalTraceParams, setGlobalTraceParams] = useState<ConvertParams>(defaultParams)
  const [globalAnimParams, setGlobalAnimParams] = useState<AnimationParams>(defaultAnimationParams)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const setGlobalTraceParam = useCallback(
    <K extends keyof ConvertParams>(key: K, value: ConvertParams[K]) => {
      setGlobalTraceParams((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const setGlobalAnimParam = useCallback(
    <K extends keyof AnimationParams>(key: K, value: AnimationParams[K]) => {
      setGlobalAnimParams((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const addFiles = useCallback((files: File[]) => {
    setQueue((prev) => {
      const remaining = MAX_BATCH_SIZE - prev.length
      if (remaining <= 0) {
        toast.error(`Queue is full. Maximum ${MAX_BATCH_SIZE} images allowed.`)
        return prev
      }

      const accepted = files.slice(0, remaining)
      if (files.length > remaining) {
        toast.warning(`Only ${remaining} file(s) added. Queue limit is ${MAX_BATCH_SIZE}.`)
      }

      const newItems: BatchItem[] = accepted.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        status: "pending",
        svgResult: null,
        errorMessage: null,
        traceOverride: null,
        animOverride: null,
      }))

      const next = [...prev, ...newItems]

      if (next.length > WARN_BATCH_SIZE) {
        toast.warning(
          `You have ${next.length} images queued. Large batches may be slow in the browser.`,
        )
      }

      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const setItemTraceOverride = useCallback((id: string, params: ConvertParams | null) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, traceOverride: params } : item)),
    )
  }, [])

  const setItemAnimOverride = useCallback((id: string, params: AnimationParams | null) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, animOverride: params } : item)),
    )
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
    setProgress({ done: 0, total: 0 })
  }, [])

  const processAll = useCallback(async () => {
    setIsProcessing(true)
    const currentQueue = queue.filter((item) => item.status !== "done")
    setProgress({ done: 0, total: currentQueue.length })

    // Reset pending items to pending in case of re-run
    setQueue((prev) =>
      prev.map((item) =>
        item.status === "error" ? { ...item, status: "pending", errorMessage: null } : item,
      ),
    )

    const results: BatchItem[] = []

    for (let i = 0; i < currentQueue.length; i++) {
      const item: BatchItem = currentQueue[i]!
      const effectiveTraceParams = item.traceOverride ?? globalTraceParams

      // Mark as converting
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "converting" } : q)))

      try {
        const formData = new FormData()
        formData.append("image", item.file)
        appendConvertParamsToFormData(formData, effectiveTraceParams)

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        })

        const data = (await response.json()) as { svg?: string; error?: string }

        if (!response.ok || !data.svg) {
          throw new Error(data.error ?? "Conversion failed")
        }

        const doneItem: BatchItem = {
          id: item.id,
          file: item.file,
          status: "done",
          svgResult: data.svg,
          errorMessage: null,
          traceOverride: item.traceOverride,
          animOverride: item.animOverride,
        }
        results.push(doneItem)

        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "done", svgResult: data.svg! } : q)),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        const errorItem: BatchItem = {
          id: item.id,
          file: item.file,
          status: "error",
          svgResult: null,
          errorMessage: message,
          traceOverride: item.traceOverride,
          animOverride: item.animOverride,
        }
        results.push(errorItem)

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "error", errorMessage: message } : q,
          ),
        )
      }

      setProgress({ done: i + 1, total: currentQueue.length })
    }

    // Assemble ZIP
    const successfulItems = results.filter((r) => r.status === "done")
    if (successfulItems.length > 0) {
      try {
        const zip = new JSZip()
        const svgsFolder = zip.folder("svgs")!
        const animationsFolder = zip.folder("animations")!

        for (const item of successfulItems) {
          const basename = item.file.name.replace(/\.[^/.]+$/, "")
          const effectiveAnimParams = item.animOverride ?? globalAnimParams

          svgsFolder.file(`${basename}.svg`, item.svgResult!)
          animationsFolder.file(
            `${basename}.html`,
            generateAnimationHtml(item.svgResult!, effectiveAnimParams),
          )
        }

        const blob = await zip.generateAsync({ type: "blob" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "batch-results.zip"
        a.click()
        URL.revokeObjectURL(url)

        toast.success(`Downloaded ${successfulItems.length} converted file(s) as batch-results.zip`)
      } catch {
        toast.error("Failed to generate ZIP archive.")
      }
    }

    if (results.some((r) => r.status === "error")) {
      toast.warning(
        `${results.filter((r) => r.status === "error").length} file(s) failed to convert.`,
      )
    }

    setIsProcessing(false)
  }, [queue, globalTraceParams, globalAnimParams])

  return {
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
  }
}
