import Link from 'next/link';

export function CartEmptyState() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#8e603f]/25 bg-[linear-gradient(180deg,rgba(42,22,16,0.96),rgba(22,10,8,0.99))] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-[#c79b6f]">
          Your Selection
        </p>
        <h2 className="font-heading text-4xl text-[#f8ece2] sm:text-5xl">
          Your cart is currently empty.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#dccabb]/78">
          Explore our handcrafted chocolate collections and add your favorite selections to begin a beautifully curated order.
        </p>

        <div className="mt-8">
          <Link
            href="/catalog"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d0a27d]/30 bg-gradient-to-r from-[#9b5d37] to-[#c48a63] px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(125,67,32,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(125,67,32,0.5)]"
          >
            Return to Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
