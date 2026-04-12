import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "fab";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-bg-primary text-text-on-primary hover:bg-brand-600",
  secondary:
    "bg-bg-secondary text-text-on-secondary hover:opacity-80",
  outline:
    "border border-solid border-border-color bg-bg-background text-text-on-background hover:bg-bg-accent hover:text-text-on-accent",
  ghost:
    "bg-transparent text-text-on-background hover:bg-bg-accent hover:text-text-on-accent",
  destructive:
    "bg-destructive text-text-on-destructive hover:opacity-90",
  link: "bg-transparent text-text-on-primary-foreground hover:underline",
  fab:
    "bg-bg-primary text-text-on-primary shadow-lg hover:bg-brand-600 disabled:shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3",
  md: "h-9 px-4",
  lg: "h-10 px-8",
  icon: "size-9 shrink-0 p-0",
};

/** Fixed 56×56 circle when `variant="fab"`; `size` is ignored for that variant. */
const fabLayoutClasses = "!rounded-full size-14 shrink-0 p-0";

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const isFab = variant === "fab";
    const base = isFab
      ? "inline-flex items-center justify-center gap-0 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
      : "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed";

    const mergedClassName = mergeClassNames(
      base,
      variantClasses[variant],
      isFab ? fabLayoutClasses : sizeClasses[size],
      fullWidth && !isFab ? "w-full" : undefined,
      className,
    );

    return (
      <button
        ref={ref}
        type={type}
        className={mergedClassName}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
