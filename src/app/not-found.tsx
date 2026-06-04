import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-zinc-950">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 max-w-md text-zinc-600">
          This route is not part of the new Fumadocs-first app.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium hover:border-emerald-700 hover:text-emerald-700"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
