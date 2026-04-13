import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/** Spacing between buttons (Tailwind `gap-*`). */
export type ButtonGroupGap = "none" | "xs" | "sm" | "md" | "lg";

/**
 * When `orientation="responsive"`, the container width at which the group
 * switches from stacked full-width buttons to an inline row with wrapping.
 */
export type ButtonGroupInlineFrom = "xs" | "sm" | "md" | "lg";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Space between adjacent buttons. */
  gap?: ButtonGroupGap;
  /**
   * `responsive` (default): stack with full-width children in narrow containers;
   * switch to a horizontal, wrapping row when the group container is wide enough.
   * `horizontal` / `vertical` fix the layout regardless of container size.
   */
  orientation?: "responsive" | "horizontal" | "vertical";
  /** Container breakpoint used when `orientation="responsive"`. */
  inlineFrom?: ButtonGroupInlineFrom;
};

const gapClasses: Record<ButtonGroupGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

/** Classes applied at and above the container breakpoint: row + wrap + intrinsic-width children. */
const inlineFromClasses: Record<ButtonGroupInlineFrom, string> = {
  xs: "@xs:flex-row @xs:flex-wrap @xs:[&>*]:w-auto",
  sm: "@sm:flex-row @sm:flex-wrap @sm:[&>*]:w-auto",
  md: "@md:flex-row @md:flex-wrap @md:[&>*]:w-auto",
  lg: "@lg:flex-row @lg:flex-wrap @lg:[&>*]:w-auto",
};

const orientationClasses: Record<
  NonNullable<ButtonGroupProps["orientation"]>,
  string
> = {
  responsive: [
    "flex flex-col",
    "[&>*]:w-full",
    // `inlineFrom` appended separately for responsive mode
  ].join(" "),
  horizontal: "flex flex-row flex-wrap [&>*]:w-auto",
  vertical: "flex flex-col [&>*]:w-full",
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      gap = "sm",
      orientation = "responsive",
      inlineFrom = "sm",
      className,
      children,
      role = "group",
      ...rest
    },
    ref,
  ) {
    // Container queries apply to *descendants* of `@container`. Layout + `@sm:` etc. must live on an inner node
    // so width is measured on the outer wrapper and flex direction can update correctly.
    const rootClassName = mergeClassNames("@container w-full", className);
    const trackClassName = mergeClassNames(
      "flex min-w-0 w-full",
      gapClasses[gap],
      orientationClasses[orientation],
      orientation === "responsive" ? inlineFromClasses[inlineFrom] : undefined,
    );

    return (
      <div ref={ref} role={role} className={rootClassName} {...rest}>
        <div className={trackClassName}>{children}</div>
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
