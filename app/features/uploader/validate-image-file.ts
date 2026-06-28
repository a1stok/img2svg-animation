// Pure validation function for image file uploads.
// Returns null if the file is valid, or a human-readable error string if not.

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}. Please upload a PNG, JPEG, or WEBP image.`
  }

  if (file.size > MAX_SIZE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    return `File is too large (${mb} MB). Maximum size is 5 MB.`
  }

  return null
}
