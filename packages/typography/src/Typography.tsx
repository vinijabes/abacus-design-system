import {
  createElement,
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type TypographyCategory = "Heading" | "Label" | "Body";

export type TypographySize = "XS" | "M" | "L" | "XL";

export type TypographyProps = {
  as?: ElementType;
  category?: TypographyCategory;
  size?: TypographySize;
} & Omit<HTMLAttributes<HTMLElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

const headingClasses: Record<TypographySize, string> = {
  XL: "text-2xl font-medium text-text-on-background",
  L: "text-xl font-medium text-text-on-background",
  M: "text-lg font-medium text-text-on-background",
  XS: "text-base font-medium text-text-on-background",
};

const bodyClasses: Record<TypographySize, string> = {
  XL: "text-lg font-normal text-text-on-background",
  L: "text-base font-normal text-text-on-background",
  M: "text-sm font-normal text-text-on-background",
  XS: "text-xs font-normal text-text-on-muted",
};

const labelClasses: Record<TypographySize, string> = {
  XL: "text-lg font-medium text-text-on-background",
  L: "text-base font-medium text-text-on-background",
  M: "text-sm font-medium text-text-on-background",
  XS: "text-xs font-medium text-text-on-muted",
};

function classesFor(
  category: TypographyCategory,
  size: TypographySize,
): string {
  if (category === "Heading") return headingClasses[size];
  if (category === "Body") return bodyClasses[size];
  return labelClasses[size];
}

function defaultElement(
  category: TypographyCategory,
  size: TypographySize,
): ElementType {
  if (category === "Body") return "p";
  if (category === "Label") return "span";
  switch (size) {
    case "XL":
      return "h1";
    case "L":
      return "h2";
    case "M":
      return "h3";
    case "XS":
      return "h4";
    default:
      return "h1";
  }
}

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

const base = "font-sans antialiased not-italic";

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  function Typography(
    {
      as,
      category = "Heading",
      size = "XL",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const Component = (as ?? defaultElement(category, size)) as ElementType;
    const mergedClassName = mergeClassNames(
      base,
      classesFor(category, size),
      className,
    );

    return createElement(Component, {
      ref,
      className: mergedClassName,
      ...rest,
    }, children);
  },
);

Typography.displayName = "Typography";
