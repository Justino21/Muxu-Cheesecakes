"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error:", error)
  }, [error])

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Something went wrong</h1>
      <p style={{ color: "#666" }}>{error.message}</p>
      <pre style={{ background: "#f5f5f5", padding: "1rem", overflow: "auto", fontSize: "12px" }}>
        {error.stack}
      </pre>
      <button
        type="button"
        onClick={reset}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Try again
      </button>
    </div>
  )
}
