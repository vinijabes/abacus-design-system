import { SegmentedControl, type SegmentedControlVariant } from "@design-system/segmented-control";
import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Tab, type TabItemSlotProps } from "./Tab";

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
  panel?: ReactNode;
  disabled?: boolean;
  icon?: ReactElement;
};

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TabsVariant;
  state?: TabsState;
  items?: TabsItem[];
  defaultActiveId?: string;
  children?: ReactNode;
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

function flattenTabItemElements(
  nodes: ReactNode,
  Item: typeof Tab.Item,
): ReactElement<TabItemSlotProps>[] {
  const out: ReactElement<TabItemSlotProps>[] = [];
  Children.forEach(nodes, (node) => {
    if (!isValidElement(node)) {
      return;
    }
    if (node.type === Fragment) {
      const { children: fragmentChildren } = node.props as { children?: ReactNode };
      out.push(...flattenTabItemElements(fragmentChildren, Item));
    } else if (node.type === Item) {
      out.push(node as ReactElement<TabItemSlotProps>);
    }
  });
  return out;
}

function itemsFromTabChildren(children: ReactNode | undefined): TabsItem[] {
  if (children == null) {
    return [];
  }
  return flattenTabItemElements(children, Tab.Item).map((el) => ({
    id: el.props.id,
    label: el.props.label,
    disabled: el.props.disabled,
    icon: el.props.icon,
    panel: el.props.children ?? "Tab content area",
  }));
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    variant = "default",
    state = "default",
    items,
    children,
    defaultActiveId,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  },
  ref,
) {
  const fromChildren = itemsFromTabChildren(children);
  const resolvedItems = fromChildren.length > 0 ? fromChildren : (items ?? []);
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
