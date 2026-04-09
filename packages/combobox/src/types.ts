import type { HTMLAttributes } from "react";

export type ComboboxSize = "sm" | "md" | "lg";
export type ComboboxState =
  | "default"
  | "hover"
  | "focused"
  | "open"
  | "disabled"
  | "error"
  | "selected"
  | "loading";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxMenuItemState = "default" | "hover" | "selected" | "disabled";

export type ComboboxMenuItemProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  state?: ComboboxMenuItemState;
};

export type ComboboxMenuProps = HTMLAttributes<HTMLDivElement>;

export type ComboboxProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: ComboboxOption[];
  placeholder?: string;
  openPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  size?: ComboboxSize;
  state?: ComboboxState;
  className?: string;
};
