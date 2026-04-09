import type { ComboboxState } from "./types";

export function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export function resolveVisualState(
  forcedState: ComboboxState | undefined,
  args: {
    disabled: boolean;
    loading: boolean;
    error: boolean;
    open: boolean;
    focused: boolean;
    hovered: boolean;
    hasSelection: boolean;
  },
): ComboboxState {
  if (forcedState != null) {
    return forcedState;
  }
  if (args.loading) {
    return "loading";
  }
  if (args.disabled) {
    return "disabled";
  }
  if (args.error) {
    return "error";
  }
  if (args.open) {
    return "open";
  }
  if (args.focused) {
    return "focused";
  }
  if (args.hovered) {
    return "hover";
  }
  if (args.hasSelection) {
    return "selected";
  }
  return "default";
}

export function triggerClassesByState(visualState: ComboboxState): string {
  if (visualState === "disabled") {
    return "border border-solid border-border-color bg-bg-muted";
  }
  if (visualState === "error") {
    return "border-2 border-solid border-destructive bg-input-background";
  }
  if (visualState === "focused" || visualState === "open") {
    return "border-2 border-solid border-ring bg-input-background";
  }
  if (visualState === "hover") {
    return "border border-solid border-zinc-400 bg-input-background";
  }
  return "border border-solid border-border-input bg-input-background";
}

export function textClassesByState(visualState: ComboboxState): string {
  if (visualState === "selected") {
    return "text-text-on-primary-foreground";
  }
  if (visualState === "disabled") {
    return "text-text-on-muted";
  }
  return "text-text-input-placeholder";
}
