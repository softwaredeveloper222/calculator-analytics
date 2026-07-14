import type { ComponentType, ReactNode, SVGProps } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold tracking-[0.2em] text-(--admin-accent-text) uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-(--admin-text) sm:text-[2rem]">
          {Icon ? (
            <Icon className="h-7 w-7 shrink-0 text-(--admin-accent-text)" />
          ) : null}
          <span>{title}</span>
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-(--admin-text-muted)">
            {description}
          </p>
        ) : null}
      </div>
      {actions}
    </header>
  );
}
