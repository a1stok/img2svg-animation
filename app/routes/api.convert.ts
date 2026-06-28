import { z } from "zod"
import type { Route } from "./+types/api.convert"
import { traceImageToSvg } from "../services/potrace-service"

const boolParam = (defaultVal: boolean) =>
  z
    .enum(["true", "false"])
    .transform((s) => s === "true")
    .default(defaultVal ? "true" : "false")

const ConvertParamsSchema = z.object({
  threshold: z.coerce.number().int().min(0).max(255).default(120),
  turdSize: z.coerce.number().min(0).default(2),
  alphaMax: z.coerce.number().min(0).max(1.3334).default(1),
  optTolerance: z.coerce.number().min(0).default(0.2),
  optCurve: boolParam(true),
  blackOnWhite: boolParam(true),
  turnPolicy: z
    .enum(["minority", "majority", "black", "white", "left", "right"])
    .default("minority"),
  color: z.string().default("auto"),
  background: z.string().default("transparent"),
})

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const file = formData.get("image")
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing image file" }, { status: 400 })
  }

  const parsed = ConvertParamsSchema.safeParse({
    threshold: formData.get("threshold"),
    turdSize: formData.get("turdSize"),
    alphaMax: formData.get("alphaMax"),
    optTolerance: formData.get("optTolerance"),
    optCurve: formData.get("optCurve"),
    blackOnWhite: formData.get("blackOnWhite"),
    turnPolicy: formData.get("turnPolicy"),
    color: formData.get("color"),
    background: formData.get("background"),
  })

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const arrayBuffer = await file.arrayBuffer()
  const imageBuffer = Buffer.from(arrayBuffer)

  try {
    const svg = await traceImageToSvg(imageBuffer, parsed.data)
    return Response.json({ svg })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Conversion failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
