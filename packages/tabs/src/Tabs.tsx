import { SegmentedControl, type SegmentedControlVariant } from "@design-system/segmented-control";
import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from "react";

export type TabsVariant =
  | "default"
  | "pill"
  | "boxed"
  | "vertical"
  | "compact"
  | "segmented";

export type TabsState = "default" | "disabled";

export type TabsItem = {
  id: string;
  label: string;
  panel?: string;
  disabled?: boolean;
  icon?: ReactElement;
};

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TabsVariant;
  state?: TabsState;
  items?: TabsItem[];
  defaultActiveId?: string;
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

function tabsVariantToControlVariant(variant: TabsVariant): SegmentedControlVariant {
  if (variant === "default") {
    return "underline";
  }
  return variant;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    variant = "default",
    state = "default",
    items,
    defaultActiveId,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  },
  ref,
) {
  const resolvedItems = items ?? [];
  const initialActive = defaultActiveId ?? resolvedItems[0]?.id ?? "";
  const [activeId, setActiveId] = useState(initialActive);
  const isDisabled = state === "disabled";
  const isVertical = variant === "vertical";

  const activePanel = useMemo(() => {
    const active = resolvedItems.find((item) => item.id === activeId) ?? resolvedItems[0];
    return active?.panel ?? "Tab content area";
  }, [resolvedItems, activeId]);

  return (
    <div
      ref={ref}
      className={mergeClassNames(
        "flex flex-col items-start",
        isVertical ? "gap-4" : variant === "boxed" ? "gap-0" : "gap-3",
        className,
      )}
      {...rest}
    >
      <div
        className={mergeClassNames(
          isVertical
            ? "flex items-stretch gap-4"
            : variant === "boxed"
              ? "flex flex-col items-start gap-0"
              : "flex flex-col items-start gap-3",
          variant === "default" ? "w-full" : undefined,
        )}
      >
        <SegmentedControl
          semantics="tabs"
          variant={tabsVariantToControlVariant(variant)}
          listUnderlineDivider={variant === "default"}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={mergeClassNames(
            "w-full",
            variant === "segmented" ? "max-w-[360px]" : undefined,
          )}
          disabled={isDisabled}
          items={resolvedItems.map(({ id, label, disabled, icon }) => ({
            id,
            label,
            disabled,
            icon,
          }))}
          value={activeId}
          onValueChange={setActiveId}
        />
        <div
          id={`panel-${activeId}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeId}`}
          className={mergeClassNames(
            "bg-bg-muted text-text-on-background",
            variant === "compact"
              ? "h-9 px-3 py-2 text-xs leading-4 w-[360px]"
              : isVertical
                ? "w-[420px] self-stretch p-3 text-sm leading-5"
                : "h-11 w-[360px] p-3 text-sm leading-5",
            variant === "boxed"
              ? "rounded-b-md border-x-2 border-b-2 border-solid border-border-primary"
              : "rounded",
          )}
        >
          {activePanel}
        </div>
      </div>
    </div>
  );
});

Tabs.displayName = "Tabs";
