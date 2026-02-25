"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Something went wrong</h1>
        <pre style={{ background: "#f5f5f5", padding: "1rem", overflow: "auto" }}>
          {error.message}
        </pre>
        <button type="button" onClick={reset} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Try again
        </button>
      </body>
    </html>
  )
}
