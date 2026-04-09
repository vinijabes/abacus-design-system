import { forwardRef } from "react";
import type { ComboboxMenuProps } from "./types";
import { mergeClassNames } from "./utils";

export const ComboboxMenu = forwardRef<HTMLDivElement, ComboboxMenuProps>(
  function ComboboxMenu({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "flex w-full flex-col items-start rounded-md border border-solid border-border-input bg-input-background p-1 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)]",
          className,
        )}
        {...rest}
      />
    );
  },
);

ComboboxMenu.displayName = "ComboboxMenu";
