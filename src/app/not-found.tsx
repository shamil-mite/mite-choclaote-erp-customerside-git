import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-4xl flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/80">404</p>
      <h1 className="mt-5 text-5xl font-semibold text-white">Page not found.</h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">The route exists in the ecommerce app structure only if it has been built intentionally. Go back to the catalog or homepage.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">Home</Link>
        <Link href="/catalog" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/8">Catalog</Link>
      </div>
    </div>
  );
}
