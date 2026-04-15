'use client';

type CartQuantityControlProps = {
  quantity: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  disabled?: boolean;
};

export function CartQuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  disabled,
}: CartQuantityControlProps) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-[#8e603f]/35 bg-[#1b0f0c]/85 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled}
        aria-label="Decrease quantity"
        className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#f2decf] transition hover:bg-[#2a1711] disabled:cursor-not-allowed disabled:opacity-50"
      >
        -
      </button>
      <div className="inline-flex h-10 min-w-11 items-center justify-center border-x border-[#8e603f]/30 px-3 text-sm font-semibold text-[#f7ede4]">
        {quantity}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#f2decf] transition hover:bg-[#2a1711] disabled:cursor-not-allowed disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}
