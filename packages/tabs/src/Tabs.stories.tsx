import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@design-system/icon";
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
      options: ["default", "pill", "boxed", "vertical", "compact"],
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

export const Playground: Story = {
  args: {
    variant: "default",
    state: "default",
    items: horizontalItems,
  },
};

export const Default: Story = {
  args: {
    variant: "default",
    state: "default",
    items: horizontalItems,
  },
};

export const DefaultDisabled: Story = {
  args: {
    variant: "default",
    state: "disabled",
    items: horizontalItems,
  },
};

export const Pill: Story = {
  args: {
    variant: "pill",
    state: "default",
    items: horizontalItems,
  },
};

export const PillDisabled: Story = {
  args: {
    variant: "pill",
    state: "disabled",
    items: horizontalItems,
  },
};

export const Boxed: Story = {
  args: {
    variant: "boxed",
    state: "default",
    items: horizontalItems,
  },
};

export const BoxedDisabled: Story = {
  args: {
    variant: "boxed",
    state: "disabled",
    items: horizontalItems,
  },
};

export const DefaultWithIconItems: Story = {
  args: {
    variant: "default",
    state: "default",
    items: [
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
    ],
  },
};

export const DefaultWithIconItemsDisabled: Story = {
  args: {
    variant: "default",
    state: "disabled",
    items: [
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
    ],
  },
};

export const Vertical: Story = {
  args: {
    variant: "vertical",
    state: "default",
    items: verticalItems,
  },
};

export const VerticalDisabled: Story = {
  args: {
    variant: "vertical",
    state: "disabled",
    items: verticalItems,
  },
};

export const Compact: Story = {
  args: {
    variant: "compact",
    state: "default",
    items: horizontalItems,
  },
};

export const CompactDisabled: Story = {
  args: {
    variant: "compact",
    state: "disabled",
    items: horizontalItems,
  },
};

export const IndividualTabDisabled: Story = {
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
