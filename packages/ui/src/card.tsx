import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-2 text-muted-foreground">{children}</div>
      </div>
    </a>
  );
}