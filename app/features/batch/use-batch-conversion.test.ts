import { describe, expect, test, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useBatchConversion } from "./use-batch-conversion"

function makeImageFile(name = "test.png"): File {
  const content = new Uint8Array(1024)
  return new File([content], name, { type: "image/png" })
}

// Mock JSZip to avoid actual zip generation in unit tests
vi.mock("jszip", () => {
  const mockFolder = vi.fn(() => ({
    file: vi.fn(),
  }))
  const MockJSZip = vi.fn(() => ({
    folder: mockFolder,
    generateAsync: vi.fn().mockResolvedValue(new Blob(["zip-content"])),
  }))
  return { default: MockJSZip }
})

// Mock sonner toasts
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}))

// Mock URL.createObjectURL / revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:mock-url")
global.URL.revokeObjectURL = vi.fn()

// Mock document.createElement for anchor clicks
const clickMock = vi.fn()
const originalCreateElement = document.createElement.bind(document)
vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
  if (tag === "a") {
    const a = originalCreateElement("a")
    a.click = clickMock
    return a
  }
  return originalCreateElement(tag)
})

describe("useBatchConversion", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("starts with an empty queue", () => {
    const { result } = renderHook(() => useBatchConversion())
    expect(result.current.queue).toHaveLength(0)
  })

  test("addFiles adds items to the queue with pending status", () => {
    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png"), makeImageFile("b.png")])
    })
    expect(result.current.queue).toHaveLength(2)
    expect(result.current.queue[0]!.status).toBe("pending")
    expect(result.current.queue[1]!.status).toBe("pending")
  })

  test("removeItem removes the correct item from the queue", () => {
    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png"), makeImageFile("b.png")])
    })
    const idToRemove = result.current.queue[0]!.id
    act(() => {
      result.current.removeItem(idToRemove)
    })
    expect(result.current.queue).toHaveLength(1)
    expect(result.current.queue[0]!.file.name).toBe("b.png")
  })

  test("clearQueue empties the queue", () => {
    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png")])
    })
    act(() => {
      result.current.clearQueue()
    })
    expect(result.current.queue).toHaveLength(0)
  })

  test("processAll marks items as done on successful conversion", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ svg: "<svg><path d='M0 0'/></svg>" }),
    } as Response)

    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png")])
    })

    await act(async () => {
      await result.current.processAll()
    })

    expect(result.current.queue[0]!.status).toBe("done")
    expect(result.current.queue[0]!.svgResult).toContain("<svg>")
  })

  test("processAll marks items as error on failed conversion", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Server error" }),
    } as Response)

    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("fail.png")])
    })

    await act(async () => {
      await result.current.processAll()
    })

    expect(result.current.queue[0]!.status).toBe("error")
    expect(result.current.queue[0]!.errorMessage).toBe("Server error")
  })

  test("processAll updates progress as items complete", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ svg: "<svg><path d='M0 0'/></svg>" }),
    } as Response)

    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png"), makeImageFile("b.png")])
    })

    await act(async () => {
      await result.current.processAll()
    })

    expect(result.current.progress).toEqual({ done: 2, total: 2 })
  })

  test("triggers zip download after successful processing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ svg: "<svg><path d='M0 0'/></svg>" }),
    } as Response)

    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("sprite.png")])
    })

    await act(async () => {
      await result.current.processAll()
    })

    expect(clickMock).toHaveBeenCalled()
  })

  test("setItemTraceOverride sets per-item trace override", () => {
    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png")])
    })
    const id = result.current.queue[0]!.id
    act(() => {
      result.current.setItemTraceOverride(id, {
        ...result.current.globalTraceParams,
        threshold: 200,
      })
    })
    expect(result.current.queue[0]!.traceOverride?.threshold).toBe(200)
  })

  test("setItemAnimOverride sets per-item animation override", () => {
    const { result } = renderHook(() => useBatchConversion())
    act(() => {
      result.current.addFiles([makeImageFile("a.png")])
    })
    const id = result.current.queue[0]!.id
    act(() => {
      result.current.setItemAnimOverride(id, {
        ...result.current.globalAnimParams,
        duration: 5000,
      })
    })
    expect(result.current.queue[0]!.animOverride?.duration).toBe(5000)
  })
})
