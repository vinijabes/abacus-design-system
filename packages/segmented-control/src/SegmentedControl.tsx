import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
} from "react";
import {
  getTabLikeListShellClasses,
  getTabLikeSegmentClasses,
  tabLikeInteractiveState,
  type SegmentedControlVariant,
} from "./segmentSurface";

export type SegmentedControlItem = {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactElement;
};

/** `radiogroup` — standalone. `tabs` — composed by `Tabs` (tablist + tab + aria-controls). */
export type SegmentedControlSemantics = "radiogroup" | "tabs";

export type SegmentedControlProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role" | "onChange"
> & {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  semantics?: SegmentedControlSemantics;
  /**
   * Visual variant. Tab-like variants match `TabItem`; `segmented` is the compact muted-track control (e.g. Abacus period filter).
   * @default "segmented"
   */
  variant?: SegmentedControlVariant;
  /** When variant is `underline`, show full-width bottom border on the tablist (used by `Tabs` `variant="default"`). */
  listUnderlineDivider?: boolean;
  tabId?: (itemId: string) => string;
  panelId?: (itemId: string) => string;
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

type TabItemIconProps = { size?: string; "aria-hidden"?: boolean };

function enabledIndices(items: SegmentedControlItem[], groupDisabled: boolean): number[] {
  return items
    .map((item, index) => (!groupDisabled && !item.disabled ? index : -1))
    .filter((i) => i >= 0);
}

function resolveSelectedId(
  candidate: string,
  items: SegmentedControlItem[],
  groupDisabled: boolean,
): string {
  const enabled = enabledIndices(items, groupDisabled);
  if (enabled.length === 0) {
    return items[0]?.id ?? "";
  }
  if (enabled.some((i) => items[i]!.id === candidate)) {
    return candidate;
  }
  return items[enabled[0]!]!.id;
}

function nextEnabledIndex(
  items: SegmentedControlItem[],
  groupDisabled: boolean,
  fromIndex: number,
  delta: 1 | -1,
): number {
  const enabled = enabledIndices(items, groupDisabled);
  if (enabled.length === 0) {
    return fromIndex;
  }
  const pos = enabled.indexOf(fromIndex);
  if (pos < 0) {
    return enabled[delta > 0 ? 0 : enabled.length - 1]!;
  }
  const nextPos = (pos + delta + enabled.length) % enabled.length;
  return enabled[nextPos]!;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      items,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled: groupDisabled = false,
      semantics = "radiogroup",
      variant: variantProp = "segmented",
      listUnderlineDivider = false,
      tabId: tabIdProp,
      panelId: panelIdProp,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const baseId = idProp ?? autoId;
    const tabIdFn = tabIdProp ?? ((itemId: string) => `tab-${itemId}`);
    const panelIdFn = panelIdProp ?? ((itemId: string) => `panel-${itemId}`);
    const isTabSemantics = semantics === "tabs";
    const refs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
      resolveSelectedId(defaultValue ?? items[0]?.id ?? "", items, groupDisabled),
    );
    const isControlled = valueProp !== undefined;
    const selectedId = resolveSelectedId(
      isControlled ? valueProp : uncontrolledValue,
      items,
      groupDisabled,
    );

    const commitSelection = useCallback(
      (next: string) => {
        const resolved = resolveSelectedId(next, items, groupDisabled);
        if (!isControlled) {
          setUncontrolledValue(resolved);
        }
        onValueChange?.(resolved);
      },
      [groupDisabled, isControlled, items, onValueChange],
    );

    const selectAndFocus = useCallback(
      (next: string, focusId: string) => {
        commitSelection(next);
        queueMicrotask(() => {
          refs.current[focusId]?.focus();
        });
      },
      [commitSelection],
    );

    const focusNeighbor = useCallback(
      (fromIndex: number, delta: 1 | -1) => {
        const nextIndex = nextEnabledIndex(items, groupDisabled, fromIndex, delta);
        const nextItem = items[nextIndex];
        if (nextItem) {
          selectAndFocus(nextItem.id, nextItem.id);
        }
      },
      [groupDisabled, items, selectAndFocus],
    );

    const listOrientationVertical = variantProp === "vertical";

    const onSegmentKeyDown = useCallback(
      (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (groupDisabled) {
          return;
        }
        const enabled = enabledIndices(items, groupDisabled);
        if (enabled.length === 0) {
          return;
        }

        const goNext = () => {
          event.preventDefault();
          focusNeighbor(index, 1);
        };
        const goPrev = () => {
          event.preventDefault();
          focusNeighbor(index, -1);
        };

        switch (event.key) {
          case "ArrowRight": {
            if (!listOrientationVertical) {
              goNext();
            }
            break;
          }
          case "ArrowDown": {
            if (listOrientationVertical) {
              goNext();
            }
            break;
          }
          case "ArrowLeft": {
            if (!listOrientationVertical) {
              goPrev();
            }
            break;
          }
          case "ArrowUp": {
            if (listOrientationVertical) {
              goPrev();
            }
            break;
          }
          case "Home": {
            event.preventDefault();
            const first = items[enabled[0]!];
            if (first) {
              selectAndFocus(first.id, first.id);
            }
            break;
          }
          case "End": {
            event.preventDefault();
            const last = items[enabled[enabled.length - 1]!]!;
            selectAndFocus(last.id, last.id);
            break;
          }
          default:
            break;
        }
      },
      [focusNeighbor, groupDisabled, items, listOrientationVertical, selectAndFocus],
    );

    const trackClass = mergeClassNames(
      "relative w-full max-w-full rounded-md border border-solid border-border-color bg-bg-muted p-1",
    );

    const segmentCount = items.length;
    const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId));

    const rootRole = isTabSemantics ? "tablist" : "radiogroup";
    const ariaOrientation = listOrientationVertical ? "vertical" : "horizontal";

    const rootClass =
      variantProp === "segmented"
        ? mergeClassNames(trackClass, className)
        : mergeClassNames(
            "max-w-full",
            getTabLikeListShellClasses(variantProp, {
              hasUnderlineDivider: variantProp === "underline" && listUnderlineDivider,
            }),
            className,
          );

    const renderIcon = (icon: ReactElement | undefined, iconSize: "sm" | "md") => {
      if (!icon) {
        return null;
      }
      return isValidElement(icon)
        ? cloneElement(icon as ReactElement<TabItemIconProps>, {
            size: (icon.props as TabItemIconProps).size ?? iconSize,
            "aria-hidden": true,
          })
        : icon;
    };

    if (variantProp === "segmented") {
      return (
        <div
          ref={ref}
          id={isTabSemantics ? undefined : baseId}
          role={rootRole}
          aria-orientation={ariaOrientation}
          aria-disabled={groupDisabled || undefined}
          className={mergeClassNames(rootClass)}
          {...rest}
        >
          <div className="relative flex min-h-8 w-full">
            {segmentCount > 0 ? (
              <div
                aria-hidden
                className={mergeClassNames(
                  "pointer-events-none absolute inset-y-0 left-0 rounded-sm border border-solid border-border-color bg-bg-primary-foreground shadow-sm",
                  "transition-transform duration-200 ease-out motion-reduce:transition-none",
                )}
                style={{
                  width: `calc(100% / ${segmentCount})`,
                  transform: `translateX(calc(${selectedIndex} * 100%))`,
                }}
              />
            ) : null}
            {items.map((item, index) => {
              const isSelected = item.id === selectedId;
              const isItemDisabled = groupDisabled || item.disabled === true;
              const tabIndex = isSelected ? 0 : -1;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    refs.current[item.id] = el;
                  }}
                  type="button"
                  role={isTabSemantics ? "tab" : "radio"}
                  aria-checked={isTabSemantics ? undefined : isSelected}
                  aria-selected={isTabSemantics ? isSelected : undefined}
                  aria-controls={isTabSemantics ? panelIdFn(item.id) : undefined}
                  aria-disabled={isItemDisabled || undefined}
                  disabled={isItemDisabled}
                  tabIndex={tabIndex}
                  id={isTabSemantics ? tabIdFn(item.id) : `${baseId}-${item.id}`}
                  className={mergeClassNames(
                    "relative z-10 flex min-h-8 min-w-0 flex-1 items-center justify-center gap-2 rounded-sm border border-transparent bg-transparent px-3 py-1.5 text-center text-xs font-medium leading-4 transition-colors duration-200 motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "text-text-on-background"
                      : mergeClassNames(
                          "text-text-on-muted",
                          !isItemDisabled
                            ? "hover:text-text-on-background"
                            : "cursor-not-allowed opacity-55",
                        ),
                  )}
                  onClick={() => {
                    if (isItemDisabled) {
                      return;
                    }
                    commitSelection(item.id);
                  }}
                  onKeyDown={(e) => onSegmentKeyDown(e, index)}
                >
                  {renderIcon(item.icon, "sm")}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    const tabLikeVariant = variantProp;
    const iconSize = tabLikeVariant === "compact" ? "sm" : "md";

    return (
      <div
        ref={ref}
        id={isTabSemantics ? undefined : baseId}
        role={rootRole}
        aria-orientation={ariaOrientation}
        aria-disabled={groupDisabled || undefined}
        className={mergeClassNames(rootClass)}
        {...rest}
      >
        {items.map((item, index) => {
          const isSelected = item.id === selectedId;
          const isItemDisabled = groupDisabled || item.disabled === true;
          const tabIndex = isSelected ? 0 : -1;
          const interactiveState = tabLikeInteractiveState(isSelected, isItemDisabled);

          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              type="button"
              role={isTabSemantics ? "tab" : "radio"}
              aria-checked={isTabSemantics ? undefined : isSelected}
              aria-selected={isTabSemantics ? isSelected : undefined}
              aria-controls={isTabSemantics ? panelIdFn(item.id) : undefined}
              aria-disabled={isItemDisabled || undefined}
              disabled={isItemDisabled}
              tabIndex={tabIndex}
              id={isTabSemantics ? tabIdFn(item.id) : `${baseId}-${item.id}`}
              className={mergeClassNames(
                getTabLikeSegmentClasses({
                  variant: tabLikeVariant,
                  interactiveState,
                  isDisabled: isItemDisabled,
                  isFirst: index === 0,
                  isLast: index === items.length - 1,
                  hasIcon: Boolean(item.icon),
                }),
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              onClick={() => {
                if (isItemDisabled) {
                  return;
                }
                commitSelection(item.id);
              }}
              onKeyDown={(e) => onSegmentKeyDown(e, index)}
            >
              {renderIcon(item.icon, iconSize)}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedControl.displayName = "SegmentedControl";
