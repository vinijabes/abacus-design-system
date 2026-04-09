import { Icon } from "@design-system/icon";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";
import { ComboboxMenu } from "./ComboboxMenu";
import { ComboboxMenuItem } from "./ComboboxMenuItem";
import type { ComboboxProps, ComboboxSize } from "./types";
import {
  mergeClassNames,
  resolveVisualState,
  textClassesByState,
  triggerClassesByState,
} from "./utils";

const triggerSizeClasses: Record<ComboboxSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-4 text-base",
};

const iconSizeClasses: Record<ComboboxSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function Combobox({
  value,
  onValueChange,
  options = [],
  placeholder = "Select option",
  openPlaceholder = "Search...",
  disabled = false,
  loading = false,
  error = false,
  size = "sm",
  state,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const visualState = resolveVisualState(state, {
    disabled,
    loading,
    error,
    open,
    focused,
    hovered,
    hasSelection: selectedOption != null,
  });

  const triggerText =
    visualState === "loading"
      ? "Loading..."
      : selectedOption?.label
        ? selectedOption.label
        : visualState === "open"
          ? openPlaceholder
          : placeholder;

  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      open={state === "open" ? true : undefined}
      onOpenChange={(nextOpen) => {
        if (state !== "open") {
          setOpen(nextOpen);
        }
      }}
      disabled={disabled || loading || state === "disabled" || state === "loading"}
    >
      <Select.Trigger
        className={mergeClassNames(
          "inline-flex w-[360px] items-center gap-2 rounded-md transition-colors",
          triggerSizeClasses[size],
          triggerClassesByState(visualState),
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-invalid={error || state === "error" || undefined}
      >
        <span
          className={mergeClassNames(
            "inline-flex items-center justify-center",
            iconSizeClasses[size],
            visualState === "disabled" ? "opacity-65" : undefined,
          )}
          aria-hidden
        >
          <Icon
            name="search"
            size={size === "lg" ? "sm" : "sm"}
            variant="clear"
            color="primary"
            className={visualState === "disabled" ? "text-text-on-muted" : "text-text-on-muted"}
          />
        </span>
        <span
          className={mergeClassNames(
            "min-w-0 flex-1 truncate text-left",
            textClassesByState(visualState),
            visualState === "disabled" ? "opacity-85" : undefined,
          )}
        >
          {triggerText}
        </span>
        <Select.Icon
          className={mergeClassNames(
            "inline-flex items-center justify-center",
            iconSizeClasses[size],
            visualState === "disabled" ? "opacity-65" : undefined,
          )}
        >
          {visualState === "loading" ? (
            <Icon
              name="loader-circle"
              size="sm"
              variant="clear"
              color="primary"
              className="animate-spin text-text-on-muted"
            />
          ) : (
            <Icon
              name="chevron-down"
              size="sm"
              variant="clear"
              color="primary"
              className="text-text-on-muted"
            />
          )}
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-50 w-[var(--radix-select-trigger-width)]"
        >
          <Select.Viewport asChild>
            <ComboboxMenu>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="outline-none"
                >
                  <Select.ItemText asChild>
                    <ComboboxMenuItem label={option.label} />
                  </Select.ItemText>
                </Select.Item>
              ))}
            </ComboboxMenu>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
