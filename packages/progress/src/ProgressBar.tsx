import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Typography } from "@design-system/typography";

export type ProgressBarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ProgressBarVariant = "solid" | "subtle" | "striped";

export type ProgressBarColor =
  | "success"
  | "primary"
  | "warning"
  | "destructive"
  | "info";

/** Inline colors for themes or one-off branding; override preset `color` when set. */
export type ProgressBarColorTokens = {
  track?: string;
  indicator?: string;
  valueText?: string;
};

export type ProgressBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role" | "aria-valuenow" | "aria-valuemin" | "aria-valuemax"
> & {
  /** 0–`max`. Omit for indeterminate (busy) progress. */
  value?: number;
  max?: number;
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  /**
   * Animated diagonal stripes on the indicator. `variant="striped"` implies this;
   * set explicitly to add stripes on top of `solid` or `subtle` fills.
   */
  striped?: boolean;
  color?: ProgressBarColor;
  /** Row label (e.g. “Upload Progress”). */
  label?: ReactNode;
  /** Right-side text; defaults to a percentage when `value` is set. */
  valueLabel?: ReactNode;
  leadingIcon?: ReactNode;
  /** Hide the header row entirely. */
  hideLabelRow?: boolean;
  tokens?: ProgressBarColorTokens;
  trackClassName?: string;
  indicatorClassName?: string;
  /** Shorthand: set on the track element for `background-color: var(--your-track)`. */
  trackStyle?: CSSProperties;
  indicatorStyle?: CSSProperties;
};

const sizeClasses: Record<ProgressBarSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
  xl: "h-4",
};

type Tone = {
  solidTrack: string;
  solidIndicator: string;
  subtleTrack: string;
  subtleIndicator: string;
  valueText: string;
};

const tones: Record<ProgressBarColor, Tone> = {
  success: {
    solidTrack: "bg-border-input",
    solidIndicator: "bg-alert-foreground-success",
    subtleTrack: "bg-alert-bg-success",
    subtleIndicator: "bg-success/45",
    valueText: "text-alert-foreground-success",
  },
  primary: {
    solidTrack: "bg-border-input",
    solidIndicator: "bg-bg-primary",
    subtleTrack: "bg-bg-primary-50",
    subtleIndicator: "bg-bg-primary-80",
    valueText: "text-text-on-primary-foreground",
  },
  warning: {
    solidTrack: "bg-border-input",
    solidIndicator: "bg-warning",
    subtleTrack: "bg-alert-bg-warning",
    subtleIndicator: "bg-warning/45",
    valueText: "text-alert-foreground-warning",
  },
  destructive: {
    solidTrack: "bg-border-input",
    solidIndicator: "bg-destructive",
    subtleTrack: "bg-alert-bg-error",
    subtleIndicator: "bg-destructive/40",
    valueText: "text-alert-foreground-error",
  },
  info: {
    solidTrack: "bg-border-input",
    solidIndicator: "bg-info",
    subtleTrack: "bg-alert-bg-info",
    subtleIndicator: "bg-info/45",
    valueText: "text-alert-foreground-info",
  },
};

const stripeOverlay: Pick<
  CSSProperties,
  "backgroundImage" | "backgroundSize" | "animation"
> = {
  backgroundImage:
    "linear-gradient(45deg, rgb(255 255 255 / 0.22) 25%, transparent 25%, transparent 50%, rgb(255 255 255 / 0.22) 50%, rgb(255 255 255 / 0.22) 75%, transparent 75%)",
  backgroundSize: "1rem 1rem",
  animation: "ds-progress-stripes 1s linear infinite",
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

function clampPercent(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value,
      max = 100,
      size = "md",
      variant = "solid",
      striped = false,
      color = "success",
      label,
      valueLabel,
      leadingIcon,
      hideLabelRow = false,
      tokens,
      trackClassName,
      indicatorClassName,
      trackStyle,
      indicatorStyle,
      className,
      id,
      "aria-label": ariaLabel,
      "aria-valuetext": ariaValueText,
      ...rest
    },
    ref,
  ) {
    const indeterminate = value === undefined;
    const percent = indeterminate ? 0 : clampPercent(value, max);

    const tone = tones[color];
    const fillIsSolid = variant === "solid" || variant === "striped";
    const trackPreset = fillIsSolid ? tone.solidTrack : tone.subtleTrack;
    const indicatorPreset = fillIsSolid ? tone.solidIndicator : tone.subtleIndicator;

    const showStripes = variant === "striped" || striped || indeterminate;

    const autoValueLabel =
      !indeterminate && valueLabel === undefined
        ? `${Math.round(percent)}%`
        : null;
    const resolvedValueSlot =
      valueLabel !== undefined ? valueLabel : autoValueLabel;

    const showHeader =
      !hideLabelRow &&
      (label != null || leadingIcon != null || resolvedValueSlot != null);

    const trackMergedClass = mergeClassNames(
      "w-full overflow-hidden rounded-full",
      sizeClasses[size],
      tokens?.track ? undefined : trackPreset,
      trackClassName,
    );

    const indicatorBaseClass = mergeClassNames(
      "h-full max-w-full rounded-full transition-[width] duration-300 ease-out",
      indeterminate ? "w-[38%] will-change-transform" : undefined,
      tokens?.indicator ? undefined : indicatorPreset,
      indicatorClassName,
    );

    const stripeStyle: CSSProperties | undefined = showStripes
      ? stripeOverlay
      : undefined;

    const indicatorMotionClass = indeterminate
      ? "motion-safe:animate-[ds-progress-indeterminate_1.5s_ease-in-out_infinite]"
      : undefined;

    const mergedTrackStyle: CSSProperties = {
      ...trackStyle,
      ...(tokens?.track ? { backgroundColor: tokens.track } : null),
    };

    const mergedIndicatorStyle: CSSProperties = {
      ...indicatorStyle,
      ...(tokens?.indicator ? { backgroundColor: tokens.indicator } : null),
      ...stripeStyle,
      ...(!indeterminate ? { width: `${percent}%` } : null),
    };

    const a11yValueText =
      ariaValueText ??
      (indeterminate
        ? "Loading"
        : typeof resolvedValueSlot === "string" || typeof resolvedValueSlot === "number"
          ? String(resolvedValueSlot)
          : `${Math.round(percent)}%`);

    return (
      <div
        ref={ref}
        className={mergeClassNames("flex w-full min-w-0 flex-col gap-2", className)}
        id={id}
        {...rest}
      >
        {showHeader ? (
          <div className="flex min-h-5 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {leadingIcon ? (
                <span className="inline-flex shrink-0 text-text-on-background [&_svg]:size-3.5">
                  {leadingIcon}
                </span>
              ) : null}
              {label != null ? (
                <Typography
                  as="span"
                  category="Label"
                  size="M"
                  className="truncate text-text-on-background"
                >
                  {label}
                </Typography>
              ) : null}
            </div>
            {resolvedValueSlot != null ? (
              <Typography
                as="span"
                category="Label"
                size="M"
                className={mergeClassNames(
                  "shrink-0 tabular-nums",
                  tokens?.valueText ? undefined : tone.valueText,
                )}
                style={tokens?.valueText ? { color: tokens.valueText } : undefined}
              >
                {resolvedValueSlot}
              </Typography>
            ) : null}
          </div>
        ) : null}

        <div
          className={trackMergedClass}
          style={mergedTrackStyle}
          role="progressbar"
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuetext={a11yValueText}
          aria-busy={indeterminate || undefined}
        >
          <div
            className={mergeClassNames(indicatorBaseClass, indicatorMotionClass)}
            style={mergedIndicatorStyle}
          />
        </div>
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";
