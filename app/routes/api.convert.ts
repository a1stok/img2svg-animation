import type { Route } from "./+types/api.convert"
import { parseConvertParamsFromFormData } from "../features/potrace/conversion-options"
import { traceImageToSvg } from "../services/potrace-service"

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const file = formData.get("image")
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing image file" }, { status: 400 })
  }

  const parsed = parseConvertParamsFromFormData(formData)

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
