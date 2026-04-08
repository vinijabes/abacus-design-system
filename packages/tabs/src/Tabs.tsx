import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { TabItem, type TabItemVariant } from "./TabItem";

export type TabsVariant =
  | "default"
  | "pill"
  | "boxed"
  | "vertical"
  | "compact";

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

function toTabItemVariant(variant: TabsVariant): TabItemVariant {
  return variant === "default" ? "underline" : variant;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    variant = "default",
    state = "default",
    items,
    defaultActiveId,
    className,
    ...rest
  },
  ref,
) {
  const resolvedItems = items ?? [];
  const initialActive = defaultActiveId ?? resolvedItems[0]?.id ?? "";
  const [activeId, setActiveId] = useState(initialActive);
  const isDisabled = state === "disabled";
  const isVertical = variant === "vertical";
  const hasDefaultDivider = variant === "default";
  const horizontalListGapClass = variant === "pill" ? "gap-0" : "gap-2";

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
          hasDefaultDivider ? "w-full" : undefined,
        )}
      >
        <div
          role="tablist"
          aria-disabled={isDisabled || undefined}
          aria-orientation={isVertical ? "vertical" : "horizontal"}
          className={mergeClassNames(
            isVertical
              ? "flex flex-col items-start border-r border-solid border-border-color"
              : mergeClassNames(
                  "flex items-start",
                  horizontalListGapClass,
                  hasDefaultDivider
                    ? "w-full border-b border-solid border-border-color"
                    : undefined,
                ),
          )}
        >
          {resolvedItems.map((item, itemIndex) => {
            const isFirstItem = itemIndex === 0;
            const isLastItem = itemIndex === resolvedItems.length - 1;
            const isActive = item.id === activeId;
            const isItemDisabled = isDisabled || item.disabled === true;
            return (
              <TabItem
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                id={`tab-${item.id}`}
                label={item.label}
                variant={toTabItemVariant(variant)}
                icon={item.icon}
                state={isItemDisabled ? "disabled" : isActive ? "active" : "default"}
                className={
                  variant === "pill"
                    ? mergeClassNames(
                        isFirstItem ? "rounded-l-md" : undefined,
                        isLastItem ? "rounded-r-md" : undefined,
                      )
                    : undefined
                }
                onClick={() => {
                  if (isItemDisabled) {
                    return;
                  }
                  setActiveId(item.id);
                }}
              />
            );
          })}
        </div>
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
