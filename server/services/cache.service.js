import { createHash } from "crypto"

// Parsing a PDF resume is the slowest thing this api does, and uploads come back around a lot
// (candidates re-upload the same resume, we retry parsing on failure), so keep the upload in a
// process level cache instead of re-reading it from disk every time.
const CACHE_BUDGET_MB = Number(process.env.RESUME_CACHE_BUDGET_MB || 64)

const cache = new Map()
let bytes = 0

const toMB = (value) => Math.round((value / 1024 / 1024) * 10) / 10

export const cacheKey = (buffer) => createHash("sha1").update(buffer).digest("hex")

export const cacheStats = () => {
  const sizeMB = toMB(bytes)
  return {
    entries: cache.size,
    sizeMB,
    budgetMB: CACHE_BUDGET_MB,
    overBudget: sizeMB >= CACHE_BUDGET_MB
  }
}

export const getCached = (key) => cache.get(key) ?? null

// Refuse new writes once the instance is out of headroom, so a full cache shows up as an
// error instead of taking the process down with it.
export const putCached = (key, value, sizeBytes) => {
  const stats = cacheStats()

  if (stats.overBudget) {
    const error = new Error(
      `resume cache over budget: ${stats.sizeMB}MB/${stats.budgetMB}MB`
    )
    error.code = "CACHE_OVER_BUDGET"
    throw error
  }

  const isNew = !cache.has(key)

  cache.set(key, value)

  if (isNew) bytes += sizeBytes

  return value
}
