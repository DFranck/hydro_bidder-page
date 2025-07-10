"use client"

import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="bg-background text-foreground p-loose flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-loosest">
          <h1 className="important-value text-palette-red mb-tight">Oops!</h1>
          <h2 className="title mb-standard">Something went wrong</h2>
          <p className="text-faded">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>

        <div className="gap-tight flex flex-col">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>

          <Link
            href="/"
            className="btn bg-shaded text-foreground hover:bg-faded/20 focus:bg-faded/20 active:bg-faded/20"
          >
            Go home
          </Link>
        </div>

        {error.digest && (
          <p className="footnote mt-loosest">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
