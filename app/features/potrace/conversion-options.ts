import { z } from "zod"

export const turnPolicies = ["minority", "majority", "black", "white", "left", "right"] as const

export type TurnPolicy = (typeof turnPolicies)[number]

const boolParam = (defaultValue: boolean) =>
  z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default(defaultValue ? "true" : "false")

export const convertParamsSchema = z.object({
  threshold: z.coerce.number().int().min(0).max(255).default(120),
  turdSize: z.coerce.number().min(0).default(2),
  alphaMax: z.coerce.number().min(0).max(1.3334).default(1),
  optTolerance: z.coerce.number().min(0).default(0.2),
  optCurve: boolParam(true),
  blackOnWhite: boolParam(true),
  turnPolicy: z.enum(turnPolicies).default("minority"),
  color: z.string().default("#000000"),
  background: z.string().default("#ffffff"),
})

export type ConvertParams = z.infer<typeof convertParamsSchema>

export const defaultParams: ConvertParams = convertParamsSchema.parse({})

const convertParamFormFields = [
  { key: "threshold", formKey: "threshold" },
  { key: "turdSize", formKey: "turdSize" },
  { key: "alphaMax", formKey: "alphaMax" },
  { key: "optTolerance", formKey: "optTolerance" },
  { key: "optCurve", formKey: "optCurve" },
  { key: "blackOnWhite", formKey: "blackOnWhite" },
  { key: "turnPolicy", formKey: "turnPolicy" },
  { key: "color", formKey: "color" },
  { key: "background", formKey: "background" },
] as const satisfies ReadonlyArray<{
  key: keyof ConvertParams
  formKey: string
}>

export function appendConvertParamsToFormData(formData: FormData, params: ConvertParams): FormData {
  for (const field of convertParamFormFields) {
    formData.set(field.formKey, String(params[field.key]))
  }

  return formData
}

export function parseConvertParamsFromFormData(formData: FormData) {
  const values: Record<string, FormDataEntryValue | undefined> = {}

  for (const field of convertParamFormFields) {
    values[field.key] = formData.get(field.formKey) ?? undefined
  }

  return convertParamsSchema.safeParse(values)
}
