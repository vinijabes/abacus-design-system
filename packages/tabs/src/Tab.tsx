import type { ReactElement, ReactNode } from "react";

export type TabItemSlotProps = {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactElement;
  children?: ReactNode;
};

function TabItemSlot(_props: TabItemSlotProps) {
  return null;
}

TabItemSlot.displayName = "Tab.Item";

export const Tab = {
  Item: TabItemSlot,
} as const;
