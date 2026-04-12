import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Typography } from "@design-system/typography";
import { twMerge } from "tailwind-merge";

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        "rounded-xl border border-solid border-border-color bg-input-background text-text-on-background",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "flex flex-col gap-1.5 p-6 pb-0",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode;
};

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, children, ...rest }, ref) {
    return (
      <Typography
        ref={ref}
        as="h3"
        category="Heading"
        size="XS"
        className={mergeClassNames("leading-none tracking-tight", className)}
        {...rest}
      >
        {children}
      </Typography>
    );
  },
);

CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription({ className, children, ...rest }, ref) {
  return (
    <Typography
      ref={ref}
      as="p"
      category="Body"
      size="L"
      className={mergeClassNames("text-text-on-muted", className)}
      {...rest}
    >
      {children}
    </Typography>
  );
});

CardDescription.displayName = "CardDescription";

export type CardContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames("px-6 pb-6 pt-6", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

export type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "flex items-center justify-end gap-2 px-6 pb-6 pt-0",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";
