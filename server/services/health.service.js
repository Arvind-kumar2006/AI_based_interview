import mongoose from "mongoose"

// /health is polled by our uptime monitor every few seconds, so it has to stay cheap and it
// has to answer two questions: can this process still serve traffic, and which build is it
// running? The release is what lets the monitor confirm that a deploy actually rolled out.
const RELEASE_ENV_KEYS = [
  "RELEASE",
  "GIT_SHA",
  "COMMIT_SHA",
  "VERCEL_GIT_COMMIT_SHA",
  "SOURCE_VERSION"
]

// Mongo may still be handshaking right after boot. Reporting "unhealthy" during that window
// would page someone for a deploy that is still starting up.
const BOOT_GRACE_MS = 60_000

const startedAt = Date.now()

export const resolveRelease = () => {
  for (const key of RELEASE_ENV_KEYS) {
    const value = process.env[key]
    if (value) return String(value).slice(0, 64)
  }
  return "dev"
}

export const describeConnection = () => ({
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  state: mongoose.connection.readyState,
  connected: mongoose.connection.readyState === 1
})

export const getHealthReport = async () => {
  const db = describeConnection()
  const booting = Date.now() - startedAt < BOOT_GRACE_MS
  const healthy = db.connected || booting

  return {
    status: healthy ? "ok" : "unhealthy",
    service: "interviewiq-api",
    release: resolveRelease(),
    uptimeSec: Math.round((Date.now() - startedAt) / 1000),
    db,
    timestamp: new Date().toISOString()
  }
}
