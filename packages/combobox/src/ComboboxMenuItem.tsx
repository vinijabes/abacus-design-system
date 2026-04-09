import { forwardRef } from "react";
import type { ComboboxMenuItemProps } from "./types";
import { mergeClassNames } from "./utils";

export const ComboboxMenuItem = forwardRef<HTMLDivElement, ComboboxMenuItemProps>(
  function ComboboxMenuItem(
    { label, state = "default", className, ...rest },
    ref,
  ) {
    const containerStateClasses =
      state === "hover"
        ? "bg-bg-muted"
        : state === "selected"
          ? "bg-bg-accent"
          : undefined;

    const textStateClasses =
      state === "disabled"
        ? "text-text-on-muted"
        : state === "selected"
          ? "text-text-on-primary-foreground"
          : "text-text-on-background";

    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "flex h-[33px] w-full items-center px-3 py-2",
          state === "disabled" ? "opacity-90" : undefined,
          containerStateClasses,
          className,
        )}
        {...rest}
      >
        <p className={mergeClassNames("flex-1 text-sm leading-[17px]", textStateClasses)}>
          {label}
        </p>
      </div>
    );
  },
);

ComboboxMenuItem.displayName = "ComboboxMenuItem";
