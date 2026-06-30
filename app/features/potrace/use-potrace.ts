import { useEffect, useRef, useState } from "react"
import { appendConvertParamsToFormData, type ConvertParams, defaultParams } from "./types"

export function usePotrace(selectedFile: File | null) {
  const [params, setParams] = useState<ConvertParams>(defaultParams)
  const [isConverting, setIsConverting] = useState(false)
  const [svgResult, setSvgResult] = useState<string | null>(null)
  const [convertError, setConvertError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  function setParam<K extends keyof ConvertParams>(key: K, value: ConvertParams[K]) {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  function resetState() {
    setSvgResult(null)
    setConvertError(null)
  }

  // Clear state when no file is selected
  useEffect(() => {
    if (selectedFile === null) {
      resetState()
    }
  }, [selectedFile])

  // Debounced auto-conversion: fires 100ms after file or params change.
  // AbortController cancels any in-flight request before starting a new one.
  useEffect(() => {
    if (selectedFile === null) return

    const controller = new AbortController()
    abortControllerRef.current = controller

    const timer = setTimeout(() => {
      void (async () => {
        setIsConverting(true)
        setConvertError(null)

        const formData = appendConvertParamsToFormData(new FormData(), params)
        formData.append("image", selectedFile)

        try {
          const response = await fetch("/api/convert", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          })
          const data = (await response.json()) as { svg?: string; error?: string }
          if (!response.ok || data.error !== undefined) {
            setConvertError(data.error ?? "Conversion failed")
          } else if (data.svg !== undefined) {
            setSvgResult(data.svg)
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return
          setConvertError("Network error. Please try again.")
        } finally {
          setIsConverting(false)
        }
      })()
    }, 100)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [selectedFile, params])

  return {
    params,
    setParam,
    isConverting,
    svgResult,
    convertError,
    resetState,
  }
}
