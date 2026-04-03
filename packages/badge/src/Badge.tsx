import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type BadgeColor =
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export type BadgeVariant = "solid" | "outline" | "subtle";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: BadgeColor;
  variant?: BadgeVariant;
  children?: ReactNode;
};

const solidColorClasses: Record<BadgeColor, string> = {
  primary: "bg-bg-primary text-text-on-primary",
  secondary: "bg-bg-secondary text-text-on-secondary",
  destructive: "bg-destructive text-text-on-destructive",
  success: "bg-success text-text-on-success",
  warning: "bg-warning text-text-on-warning",
  info: "bg-info text-text-on-info",
};

const subtleColorClasses: Record<BadgeColor, string> = {
  primary: "bg-bg-primary-80 text-text-on-primary",
  secondary: "bg-bg-secondary-80 text-text-on-secondary",
  destructive: "bg-destructive-80 text-text-on-destructive",
  success: "bg-success-80 text-text-on-success",
  warning: "bg-warning-80 text-text-on-warning",
  info: "bg-info-80 text-text-on-info",
};

const outlineClasses =
  "border-border-color bg-bg-background text-text-on-background";

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

function variantColorClasses(
  variant: BadgeVariant,
  color: BadgeColor,
): string {
  if (variant === "outline") {
    return outlineClasses;
  }
  if (variant === "subtle") {
    return subtleColorClasses[color];
  }
  return solidColorClasses[color];
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    color = "primary",
    variant = "solid",
    className,
    children,
    ...rest
  },
  ref,
) {
  const base =
    "inline-flex items-center justify-center rounded-md border border-solid font-medium text-xs px-2.5 py-0.5 whitespace-nowrap";

  const variantClasses = variantColorClasses(variant, color);
  const borderTone =
    variant === "outline"
      ? undefined
      : "border-transparent";

  const mergedClassName = mergeClassNames(
    base,
    variantClasses,
    borderTone,
    className,
  );

  return (
    <span ref={ref} className={mergedClassName} {...rest}>
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
