import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

export type TabItemState = "default" | "hover" | "active" | "disabled";
export type TabItemVariant =
  | "underline"
  | "pill"
  | "boxed"
  | "vertical"
  | "compact";

export type TabItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  state?: TabItemState;
  variant?: TabItemVariant;
  label?: string;
  icon?: ReactElement;
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

const textClassByState: Record<TabItemState, string> = {
  default: "text-text-on-background",
  hover: "text-text-on-background",
  active: "text-text-on-primary-foreground",
  disabled: "text-text-input-placeholder",
};

const surfaceClassByVariantState: Record<TabItemVariant, Record<TabItemState, string>> = {
  underline: {
    default: "border-b-2 border-transparent -mb-px",
    hover: "border-b-2 border-transparent -mb-px",
    active: "border-b-2 border-border-primary -mb-px",
    disabled: "border-b-2 border-transparent -mb-px",
  },
  pill: {
    default: "bg-bg-background",
    hover: "bg-bg-muted",
    active: "bg-bg-accent",
    disabled: "bg-bg-background",
  },
  boxed: {
    default: "rounded-t-md border-2 border-solid border-border-color bg-bg-background",
    hover: "rounded-t-md border-2 border-solid border-border-color bg-bg-muted",
    active: "rounded-t-md border-2 border-border-primary bg-bg-accent",
    disabled: "rounded-t-md border-2 border-solid border-border-color bg-bg-background",
  },
  vertical: {
    default: "px-4 py-3",
    hover: "px-4 py-3 bg-bg-muted",
    active: "px-4 py-3 border-r-2 border-border-primary bg-bg-accent",
    disabled: "px-4 py-3",
  },
  compact: {
    default: "",
    hover: "",
    active: "border-b-2 border-border-primary",
    disabled: "",
  },
};

const hoverClassByVariant: Record<TabItemVariant, string> = {
  underline: "",
  pill: "hover:bg-bg-muted",
  boxed: "hover:bg-bg-muted",
  vertical: "hover:bg-bg-muted",
  compact: "",
};

const hoverActiveBorderByVariant: Record<TabItemVariant, string> = {
  underline: "hover:border-b-2 hover:border-border-primary",
  pill: "",
  boxed: "",
  vertical: "",
  compact: "hover:border-b-2 hover:border-border-primary",
};

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(function TabItem(
  {
    state = "default",
    variant = "underline",
    label = "Overview",
    icon,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || state === "disabled";
  const interactiveState =
    state === "active"
      ? "active"
      : state === "hover"
        ? "hover"
        : state === "disabled"
          ? "disabled"
          : "default";

  const base = "group inline-flex items-center justify-center font-normal transition-colors";
  const sizeClass =
    variant === "compact" ? "px-3 py-2 text-xs leading-4" : "px-5 py-3 text-sm leading-5";
  const iconSize = variant === "compact" ? "sm" : "md";
  const resolvedIcon = icon
    ? isValidElement(icon)
      ? cloneElement(icon, {
          size: (icon.props as { size?: string }).size ?? iconSize,
          "aria-hidden": true,
        })
      : icon
    : null;

  return (
    <button
      ref={ref}
      type="button"
      className={mergeClassNames(
        base,
        sizeClass,
        surfaceClassByVariantState[variant][interactiveState],
        icon ? "gap-2" : undefined,
        textClassByState[interactiveState],
        interactiveState === "default" && !isDisabled
          ? hoverClassByVariant[variant]
          : undefined,
        interactiveState === "default" && !isDisabled
          ? hoverActiveBorderByVariant[variant]
          : undefined,
        isDisabled ? "opacity-55 cursor-not-allowed" : undefined,
        className,
      )}
      disabled={isDisabled}
      {...rest}
    >
      {resolvedIcon}
      {label}
    </button>
  );
});

TabItem.displayName = "TabItem";
