import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@design-system/icon";
import { Tab } from "./Tab";
import { Tabs } from "./Tabs";
import { TabItem } from "./TabItem";

const meta = {
  title: "Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "test"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "pill", "boxed", "vertical", "compact", "segmented"],
    },
    state: {
      control: "select",
      options: ["default", "disabled"],
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const horizontalItems = [
  { id: "overview", label: "Overview", panel: "Tab content area" },
  { id: "analytics", label: "Analytics", panel: "Tab content area" },
  { id: "settings", label: "Settings", panel: "Tab content area" },
];

const verticalItems = [
  { id: "profile", label: "Profile", panel: "Vertical tab content area" },
  { id: "account", label: "Account", panel: "Vertical tab content area" },
  { id: "security", label: "Security", panel: "Vertical tab content area" },
];

const horizontalItemsWithIcons = [
  {
    id: "overview",
    label: "Overview",
    panel: "Tab content area",
    icon: <Icon name="file-text" variant="clear" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    panel: "Tab content area",
    icon: <Icon name="chart-column" variant="clear" />,
  },
  {
    id: "settings",
    label: "Settings",
    panel: "Tab content area",
    icon: <Icon name="settings-2" variant="clear" />,
  },
];

const verticalItemsWithIcons = [
  {
    id: "profile",
    label: "Profile",
    panel: "Vertical tab content area",
    icon: <Icon name="file-text" variant="clear" />,
  },
  {
    id: "account",
    label: "Account",
    panel: "Vertical tab content area",
    icon: <Icon name="chart-column" variant="clear" />,
  },
  {
    id: "security",
    label: "Security",
    panel: "Vertical tab content area",
    icon: <Icon name="settings-2" variant="clear" />,
  },
];

const segmentedItemsWithIcons = [
  {
    id: "this",
    label: "This month",
    panel: "Surface: this month",
    icon: <Icon name="calendar" variant="clear" />,
  },
  {
    id: "last",
    label: "Last month",
    panel: "Surface: last month",
    icon: <Icon name="calendar-range" variant="clear" />,
  },
];

export const Playground: Story = {
  args: {
    variant: "default",
    state: "default",
    items: horizontalItems,
  },
};

export const CompoundItems: Story = {
  name: "Composition / Tab.Item children",
  render: (args) => (
    <Tabs variant={args.variant} state={args.state} defaultActiveId={args.defaultActiveId}>
      <Tab.Item id="overview" label="Overview">
        Overview panel content.
      </Tab.Item>
      <Tab.Item id="analytics" label="Analytics">
        Analytics panel content.
      </Tab.Item>
      <Tab.Item id="settings" label="Settings">
        Settings panel content.
      </Tab.Item>
    </Tabs>
  ),
  args: {
    variant: "default",
    state: "default",
  },
};

export const Default: Story = {
  name: "Variants / Default",
  args: {
    variant: "default",
    state: "default",
    items: horizontalItems,
  },
};

export const DefaultDisabled: Story = {
  name: "Variants / Default · disabled",
  args: {
    variant: "default",
    state: "disabled",
    items: horizontalItems,
  },
};

export const Pill: Story = {
  name: "Variants / Pill",
  args: {
    variant: "pill",
    state: "default",
    items: horizontalItems,
  },
};

export const PillDisabled: Story = {
  name: "Variants / Pill · disabled",
  args: {
    variant: "pill",
    state: "disabled",
    items: horizontalItems,
  },
};

export const Boxed: Story = {
  name: "Variants / Boxed",
  args: {
    variant: "boxed",
    state: "default",
    items: horizontalItems,
  },
};

export const BoxedDisabled: Story = {
  name: "Variants / Boxed · disabled",
  args: {
    variant: "boxed",
    state: "disabled",
    items: horizontalItems,
  },
};

export const DefaultWithIconItems: Story = {
  name: "Variants / Default with icons",
  args: {
    variant: "default",
    state: "default",
    items: horizontalItemsWithIcons,
  },
};

export const DefaultWithIconItemsDisabled: Story = {
  name: "Variants / Default with icons · disabled",
  args: {
    variant: "default",
    state: "disabled",
    items: horizontalItemsWithIcons,
  },
};

export const PillWithIconItems: Story = {
  name: "Variants / Pill with icons",
  args: {
    variant: "pill",
    state: "default",
    items: horizontalItemsWithIcons,
  },
};

export const BoxedWithIconItems: Story = {
  name: "Variants / Boxed with icons",
  args: {
    variant: "boxed",
    state: "default",
    items: horizontalItemsWithIcons,
  },
};

export const CompactWithIconItems: Story = {
  name: "Variants / Compact with icons",
  args: {
    variant: "compact",
    state: "default",
    items: horizontalItemsWithIcons,
  },
};

export const VerticalWithIconItems: Story = {
  name: "Variants / Vertical with icons",
  args: {
    variant: "vertical",
    state: "default",
    items: verticalItemsWithIcons,
  },
};

export const SegmentedWithIconItems: Story = {
  name: "Variants / Segmented with icons",
  args: {
    variant: "segmented",
    state: "default",
    items: segmentedItemsWithIcons,
    defaultActiveId: "this",
    "aria-label": "Reporting period",
  },
};

export const Vertical: Story = {
  name: "Variants / Vertical",
  args: {
    variant: "vertical",
    state: "default",
    items: verticalItems,
  },
};

export const VerticalDisabled: Story = {
  name: "Variants / Vertical · disabled",
  args: {
    variant: "vertical",
    state: "disabled",
    items: verticalItems,
  },
};

export const Compact: Story = {
  name: "Variants / Compact",
  args: {
    variant: "compact",
    state: "default",
    items: horizontalItems,
  },
};

export const CompactDisabled: Story = {
  name: "Variants / Compact · disabled",
  args: {
    variant: "compact",
    state: "disabled",
    items: horizontalItems,
  },
};

export const IndividualTabDisabled: Story = {
  name: "Variants / Individual tab disabled",
  args: {
    variant: "default",
    state: "default",
    items: [
      { id: "overview", label: "Overview", panel: "Tab content area" },
      { id: "analytics", label: "Analytics", panel: "Tab content area", disabled: true },
      { id: "settings", label: "Settings", panel: "Tab content area" },
    ],
  },
};

const segmentedPanelItems = [
  { id: "this", label: "This month", panel: "Surface: this month" },
  { id: "last", label: "Last month", panel: "Surface: last month" },
];

/** `Tabs` always uses `SegmentedControl` as the tab controller; this is the compact `segmented` variant. */
export const Segmented: Story = {
  name: "Variants / Segmented",
  args: {
    variant: "segmented",
    state: "default",
    items: segmentedPanelItems,
    defaultActiveId: "this",
    "aria-label": "Reporting period",
  },
};

export const SegmentedDisabled: Story = {
  name: "Variants / Segmented · disabled",
  args: {
    variant: "segmented",
    state: "disabled",
    items: segmentedPanelItems,
    "aria-label": "Reporting period",
  },
};

export const SegmentedThreePanels: Story = {
  name: "Variants / Segmented · three panels",
  args: {
    variant: "segmented",
    state: "default",
    items: [
      { id: "overview", label: "Overview", panel: "Overview surface" },
      { id: "analytics", label: "Analytics", panel: "Analytics surface" },
      { id: "settings", label: "Settings", panel: "Settings surface" },
    ],
    "aria-label": "Workspace section",
  },
};

export const TabItemStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <TabItem variant="underline" state="default" />
        <TabItem variant="underline" state="hover" />
        <TabItem variant="underline" state="active" />
        <TabItem variant="underline" state="disabled" />
      </div>
      <div className="flex flex-wrap gap-3">
        <TabItem variant="pill" state="default" />
        <TabItem variant="pill" state="hover" />
        <TabItem variant="pill" state="active" />
        <TabItem variant="pill" state="disabled" />
      </div>
      <div className="flex flex-wrap gap-3">
        <TabItem variant="boxed" state="default" />
        <TabItem variant="boxed" state="hover" />
        <TabItem variant="boxed" state="active" />
        <TabItem variant="boxed" state="disabled" />
      </div>
      <div className="flex flex-wrap gap-3">
        <TabItem
          variant="underline"
          state="default"
          icon={<Icon name="circle" variant="clear" />}
        />
        <TabItem
          variant="underline"
          state="hover"
          icon={<Icon name="circle" variant="clear" />}
        />
        <TabItem
          variant="underline"
          state="active"
          icon={<Icon name="circle" variant="clear" />}
        />
        <TabItem
          variant="underline"
          state="disabled"
          icon={<Icon name="circle" variant="clear" />}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <TabItem variant="vertical" state="default" />
        <TabItem variant="vertical" state="hover" />
        <TabItem variant="vertical" state="active" />
        <TabItem variant="vertical" state="disabled" />
      </div>
      <div className="flex flex-wrap gap-3">
        <TabItem variant="compact" state="default" />
        <TabItem variant="compact" state="hover" />
        <TabItem variant="compact" state="active" />
        <TabItem variant="compact" state="disabled" />
      </div>
    </div>
  ),
};
