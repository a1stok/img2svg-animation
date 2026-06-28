import { z } from "zod"
import type { Route } from "./+types/api.convert"

const ConvertRequestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  base64Data: z.string().min(1),
})

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json()
  const parsed = ConvertRequestSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  // TODO: pass parsed.data to the potrace service
  return Response.json({ success: true, svg: "" })
}
