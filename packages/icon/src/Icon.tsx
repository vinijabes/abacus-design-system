import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";

export type IconSize = "sm" | "md" | "lg" | "xl";
export type IconVariant = "solid" | "outline" | "clear" | "ghost";
export type IconColor =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info";

const glyphPx: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const outerSizeClass: Record<IconSize, string> = {
  sm: "size-6 min-h-6 min-w-6",
  md: "size-7 min-h-7 min-w-7",
  lg: "size-10 min-h-10 min-w-10",
  xl: "size-12 min-h-12 min-w-12",
};

const paddedVariantPadding: Record<IconSize, string> = {
  sm: "p-1",
  md: "p-1",
  lg: "p-2",
  xl: "p-2",
};

const solidColor: Record<IconColor, string> = {
  primary: "bg-bg-primary text-text-on-primary",
  success: "bg-success text-text-on-success",
  warning: "bg-warning text-text-on-warning",
  destructive: "bg-destructive text-text-on-destructive",
  info: "bg-info text-text-on-info",
};

const outlineColor: Record<IconColor, string> = {
  primary:
    "border border-border-primary bg-transparent text-text-on-primary-foreground",
  success: "border border-success bg-transparent text-success",
  warning: "border border-warning bg-transparent text-warning",
  destructive: "border border-destructive bg-transparent text-destructive",
  info: "border border-info bg-transparent text-info",
};

const ghostColor: Record<IconColor, string> = {
  primary:
    "bg-transparent text-text-on-primary-foreground hover:bg-bg-accent hover:text-text-on-accent",
  success:
    "bg-transparent text-success hover:bg-bg-accent hover:text-text-on-accent",
  warning:
    "bg-transparent text-warning hover:bg-bg-accent hover:text-text-on-accent",
  destructive:
    "bg-transparent text-destructive hover:bg-bg-accent hover:text-text-on-accent",
  info: "bg-transparent text-info hover:bg-bg-accent hover:text-text-on-accent",
};

const clearColor: Record<IconColor, string> = {
  primary: "text-text-on-primary-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export type IconProps = Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "color"
> & {
  /** Lucide icon name (kebab-case); all icons supported via dynamic loading. */
  name: IconName;
  size?: IconSize;
  variant?: IconVariant;
  color?: IconColor;
  /** Extra props for the rendered SVG (e.g. strokeWidth). */
  iconProps?: Omit<
    ComponentPropsWithoutRef<typeof DynamicIcon>,
    "name" | "ref"
  >;
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  {
    name,
    size = "md",
    variant = "clear",
    color = "primary",
    className,
    iconProps,
    "aria-hidden": ariaHidden,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const px = glyphPx[size];
  const resolvedAriaHidden =
    ariaHidden ?? (ariaLabel == null || ariaLabel === "" ? true : undefined);

  const inner = (
    <DynamicIcon
      name={name}
      size={px}
      {...iconProps}
      className={mergeClassNames("shrink-0", iconProps?.className)}
    />
  );

  if (variant === "clear") {
    return (
      <span
        ref={ref}
        className={mergeClassNames(
          "inline-flex items-center justify-center transition-colors",
          clearColor[color],
          className,
        )}
        aria-hidden={resolvedAriaHidden}
        aria-label={ariaLabel}
        {...rest}
      >
        {inner}
      </span>
    );
  }

  const variantClass =
    variant === "solid"
      ? mergeClassNames(solidColor[color], "rounded-lg")
      : variant === "outline"
        ? mergeClassNames(outlineColor[color], "rounded-lg")
        : mergeClassNames(ghostColor[color], "rounded-lg");

  return (
    <span
      ref={ref}
      className={mergeClassNames(
        "inline-flex items-center justify-center transition-colors",
        outerSizeClass[size],
        paddedVariantPadding[size],
        variantClass,
        className,
      )}
      aria-hidden={resolvedAriaHidden}
      aria-label={ariaLabel}
      {...rest}
    >
      {inner}
    </span>
  );
});

Icon.displayName = "Icon";
