export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-sky-300">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
