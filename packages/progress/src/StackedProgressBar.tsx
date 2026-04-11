import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Typography } from "@design-system/typography";
import type { ProgressBarColor, ProgressBarColorTokens, ProgressBarSize } from "./ProgressBar";

export type StackedSegment = {
  /** Share of the bar; values are normalized to 100% if they do not sum to 100. */
  percent: number;
  color: ProgressBarColor;
  className?: string;
  style?: CSSProperties;
  /** Included in the default `aria-label` and optional legend. */
  label?: string;
};

export type StackedProgressBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role" | "aria-label"
> & {
  segments: StackedSegment[];
  size?: ProgressBarSize;
  /** Solid = neutral track (`border-input`); subtle = muted track (`bg-muted`). */
  variant?: "solid" | "subtle";
  label?: ReactNode;
  /** Defaults to a compact summary like `30% · 50% · 20%` from segment percents. */
  valueLabel?: ReactNode;
  leadingIcon?: ReactNode;
  hideLabelRow?: boolean;
  tokens?: Pick<ProgressBarColorTokens, "track" | "valueText">;
  trackClassName?: string;
  trackStyle?: CSSProperties;
  /** Overrides auto-generated accessible name for the bar group. */
  "aria-label"?: string;
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

const sizeClasses: Record<ProgressBarSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
  xl: "h-4",
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export function normalizeStackedPercents(
  segments: StackedSegment[],
): { segment: StackedSegment; widthPct: number }[] {
  const raw = segments.map((s) =>
    Math.max(0, Number.isFinite(s.percent) ? s.percent : 0),
  );
  const total = raw.reduce((a, b) => a + b, 0);
  if (total === 0) {
    return segments.map((segment) => ({ segment, widthPct: 0 }));
  }
  return segments.map((segment, i) => ({
    segment,
    widthPct: ((raw[i] ?? 0) / total) * 100,
  }));
}

function segmentFillClass(
  color: ProgressBarColor,
  variant: "solid" | "subtle",
): string {
  const t = tones[color];
  return variant === "solid" ? t.solidIndicator : t.subtleIndicator;
}

export const StackedProgressBar = forwardRef<
  HTMLDivElement,
  StackedProgressBarProps
>(function StackedProgressBar(
  {
    segments,
    size = "md",
    variant = "solid",
    label,
    valueLabel,
    leadingIcon,
    hideLabelRow = false,
    tokens,
    trackClassName,
    trackStyle,
    className,
    id,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const normalized = normalizeStackedPercents(segments);

  const firstValueTone = segments[0]?.color
    ? tones[segments[0].color].valueText
    : "text-text-on-primary-foreground";

  const autoValueLabel =
    valueLabel === undefined
      ? normalized
          .map(({ widthPct }) => `${Math.round(widthPct)}%`)
          .join(" · ")
      : null;
  const resolvedValueSlot =
    valueLabel !== undefined ? valueLabel : autoValueLabel;

  const showHeader =
    !hideLabelRow &&
    (label != null || leadingIcon != null || resolvedValueSlot != null);

  const trackBase =
    variant === "solid" ? "bg-border-input" : "bg-bg-muted";
  const trackMergedClass = mergeClassNames(
    "flex w-full min-w-0 overflow-hidden rounded-full",
    sizeClasses[size],
    tokens?.track ? undefined : trackBase,
    trackClassName,
  );

  const mergedTrackStyle: CSSProperties = {
    ...trackStyle,
    ...(tokens?.track ? { backgroundColor: tokens.track } : null),
  };

  const defaultAria =
    normalized.length === 0
      ? "Progress"
      : normalized
          .map(({ segment, widthPct }) => {
            const name = segment.label ?? segment.color;
            return `${Math.round(widthPct)}% ${name}`;
          })
          .join(", ");

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
                tokens?.valueText ? undefined : firstValueTone,
              )}
              style={
                tokens?.valueText ? { color: tokens.valueText } : undefined
              }
            >
              {resolvedValueSlot}
            </Typography>
          ) : null}
        </div>
      ) : null}

      <div
        role="group"
        aria-label={ariaLabel ?? defaultAria}
        className={trackMergedClass}
        style={mergedTrackStyle}
      >
        {normalized.map(({ segment, widthPct }, i) => {
          if (widthPct <= 0) return null;
          const usePresetFill =
            !segment.className && segment.style?.backgroundColor == null;
          return (
            <div
              key={i}
              className={mergeClassNames(
                "h-full min-w-0 shrink-0 transition-[width] duration-300 ease-out",
                usePresetFill
                  ? segmentFillClass(segment.color, variant)
                  : undefined,
                segment.className,
              )}
              style={{
                width: `${widthPct}%`,
                ...segment.style,
              }}
              title={
                segment.label
                  ? `${segment.label}: ${Math.round(widthPct)}%`
                  : `${segment.color}: ${Math.round(widthPct)}%`
              }
            />
          );
        })}
      </div>
    </div>
  );
});

StackedProgressBar.displayName = "StackedProgressBar";
