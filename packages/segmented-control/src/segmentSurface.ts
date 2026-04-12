import type { ReactElement } from "react";

/** Visual styles shared with `TabItem` (underline through compact). */
export type TabLikeSegmentVariant = "underline" | "pill" | "boxed" | "vertical" | "compact";

export type TabLikeInteractiveState = "default" | "hover" | "active" | "disabled";

export type SegmentedControlVariant = TabLikeSegmentVariant | "segmented";

const textClassByState: Record<TabLikeInteractiveState, string> = {
  default: "text-text-on-background",
  hover: "text-text-on-background",
  active: "text-text-on-primary-foreground",
  disabled: "text-text-input-placeholder",
};

const surfaceClassByVariantState: Record<
  TabLikeSegmentVariant,
  Record<TabLikeInteractiveState, string>
> = {
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

const hoverClassByVariant: Record<TabLikeSegmentVariant, string> = {
  underline: "",
  pill: "hover:bg-bg-muted",
  boxed: "hover:bg-bg-muted",
  vertical: "hover:bg-bg-muted",
  compact: "",
};

const hoverActiveBorderByVariant: Record<TabLikeSegmentVariant, string> = {
  underline: "hover:border-b-2 hover:border-border-primary",
  pill: "",
  boxed: "",
  vertical: "",
  compact: "hover:border-b-2 hover:border-border-primary",
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export type TabLikeSegmentClassOptions = {
  variant: TabLikeSegmentVariant;
  interactiveState: TabLikeInteractiveState;
  isDisabled: boolean;
  isFirst: boolean;
  isLast: boolean;
  hasIcon: boolean;
  /** Extra classes (e.g. pill end caps). */
  className?: string;
};

/**
 * Button surface classes for tab-like variants (not `segmented`).
 * Used by `TabItem` and `SegmentedControl` so tab strip visuals stay in sync.
 */
export function getTabLikeSegmentClasses(options: TabLikeSegmentClassOptions): string {
  const {
    variant,
    interactiveState,
    isDisabled,
    isFirst,
    isLast,
    hasIcon,
    className,
  } = options;

  const base = "group inline-flex items-center justify-center font-normal transition-colors";
  const sizeClass =
    variant === "compact" ? "px-3 py-2 text-xs leading-4" : "px-5 py-3 text-sm leading-5";

  return mergeClassNames(
    base,
    sizeClass,
    surfaceClassByVariantState[variant][interactiveState],
    hasIcon ? "gap-2" : undefined,
    textClassByState[interactiveState],
    interactiveState === "default" && !isDisabled ? hoverClassByVariant[variant] : undefined,
    interactiveState === "default" && !isDisabled
      ? hoverActiveBorderByVariant[variant]
      : undefined,
    isDisabled ? "opacity-55 cursor-not-allowed" : undefined,
    variant === "pill"
      ? mergeClassNames(isFirst ? "rounded-l-md" : undefined, isLast ? "rounded-r-md" : undefined)
      : undefined,
    className,
  );
}

export function tabLikeInteractiveState(
  isSelected: boolean,
  isDisabled: boolean,
): TabLikeInteractiveState {
  if (isDisabled) {
    return "disabled";
  }
  return isSelected ? "active" : "default";
}

/** Tablist shell classes (outer `role="tablist"` / radiogroup wrapper for tab-like variants). */
export function getTabLikeListShellClasses(
  variant: TabLikeSegmentVariant,
  options: { hasUnderlineDivider: boolean },
): string {
  const { hasUnderlineDivider } = options;
  if (variant === "vertical") {
    return "flex flex-col items-start border-r border-solid border-border-color";
  }
  const horizontalGap = variant === "pill" ? "gap-0" : "gap-2";
  return mergeClassNames(
    "flex items-start",
    horizontalGap,
    hasUnderlineDivider ? "w-full border-b border-solid border-border-color" : undefined,
  );
}
