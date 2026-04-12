import {
  getTabLikeSegmentClasses,
  type TabLikeSegmentVariant,
} from "@design-system/segmented-control";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

type TabItemIconProps = { size?: string; "aria-hidden"?: boolean };

export type TabItemState = "default" | "hover" | "active" | "disabled";
export type TabItemVariant = TabLikeSegmentVariant;

export type TabItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  state?: TabItemState;
  variant?: TabItemVariant;
  label?: string;
  icon?: ReactElement;
  /** When rendering a pill row, pass corner rounding (matches `SegmentedControl` tab strip). */
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(function TabItem(
  {
    state = "default",
    variant = "underline",
    label = "Overview",
    icon,
    className,
    disabled,
    isFirstInGroup = true,
    isLastInGroup = true,
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

  const iconSize = variant === "compact" ? "sm" : "md";
  const resolvedIcon = icon
    ? isValidElement(icon)
      ? cloneElement(icon as ReactElement<TabItemIconProps>, {
          size: (icon.props as TabItemIconProps).size ?? iconSize,
          "aria-hidden": true,
        })
      : icon
    : null;

  return (
    <button
      ref={ref}
      type="button"
      className={mergeClassNames(
        getTabLikeSegmentClasses({
          variant,
          interactiveState,
          isDisabled,
          isFirst: isFirstInGroup,
          isLast: isLastInGroup,
          hasIcon: Boolean(icon),
        }),
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
