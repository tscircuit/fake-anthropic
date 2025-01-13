export function normalizeForSnapshot(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(normalizeForSnapshot)
  }

  if (obj && typeof obj === "object") {
    const normalized: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("id")) {
        normalized[key] = "[id]"
      } else {
        normalized[key] = normalizeForSnapshot(value)
      }
    }
    return normalized
  }

  return obj
}
