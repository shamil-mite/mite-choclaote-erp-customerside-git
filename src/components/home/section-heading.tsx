type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div className={isCentered ? 'text-center' : 'text-left'}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-[#c79b6f]">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="font-heading text-3xl tracking-tight text-[#f6eadf] sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#d8c4b3]/80 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
