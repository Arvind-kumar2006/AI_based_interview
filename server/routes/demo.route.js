import express from "express"
import { cacheKey, cacheStats, putCached } from "../services/cache.service.js"

// Load generator used to rehearse a burst of resume uploads against the api.
const demoRouter = express.Router()

demoRouter.post("/simulate-upload-burst", async (req, res) => {
  const uploads = Math.min(Math.max(Number(req.body?.uploads) || 50, 1), 500)
  const sizeKb = Math.min(Math.max(Number(req.body?.sizeKb) || 1536, 1), 8192)
  const before = cacheStats()

  const results = []
  for (let i = 0; i < uploads; i++) {
    try {
      // a different resume every time, so each one is its own cache entry
      const buffer = Buffer.alloc(sizeKb * 1024, 0x20 + (i % 200))
      putCached(cacheKey(buffer), buffer, buffer.length)
    } catch (error) {
      results.push(error.message)
    }
  }

  res.json({
    fired: uploads,
    rejected: results.length,
    firstError: results[0] ?? null,
    cacheBefore: before,
    cache: cacheStats()
  })
})

demoRouter.get("/cache", (req, res) => {
  res.json(cacheStats())
})

export default demoRouter
