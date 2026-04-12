import { Icon } from "@design-system/icon";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";

const figmaAbacusSegmented =
  "https://www.figma.com/design/y70O9MsPCJeRCOJS8YGpCp/Abacus?node-id=107-177&m=dev";

const meta = {
  title: "SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Segmented control** — mutually exclusive options with shared interaction (roving tabindex, arrows, Home/End). The \`variant\` prop selects the **visual language**: \`segmented\` is the compact muted-track + sliding thumb (e.g. [Abacus period filter](${figmaAbacusSegmented})); \`underline\`, \`pill\`, \`boxed\`, \`vertical\`, and \`compact\` match the former \`TabItem\` styles. Default \`semantics="radiogroup"\` / \`radio\` + \`aria-checked\`; \`semantics="tabs"\` uses \`tablist\` / \`tab\` + \`aria-selected\` / \`aria-controls\`.

**\`Tabs\`** always uses \`SegmentedControl\` with \`semantics="tabs"\` as the tab controller and maps \`Tabs\` \`variant\` to this component’s \`variant\` (\`default\` → \`underline\`, \`segmented\` → \`segmented\`, etc.), then renders the \`tabpanel\` below.

**Standalone vs \`Tabs\`**

- **Standalone** \`SegmentedControl\` — filters or modes **without** a built-in panel (stay on \`radiogroup\` unless you wire panels yourself).
- **\`Tabs\`** — same control for the strip + **panel swap** for each tab.
`,
      },
    },
  },
  tags: ["autodocs", "test"],
  argTypes: {
    disabled: { control: "boolean" },
    variant: {
      control: "select",
      options: ["segmented", "underline", "pill", "boxed", "vertical", "compact"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,390px)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const monthItems = [
  { id: "this", label: "This month" },
  { id: "last", label: "Last month" },
];

/** Three labels used for tab-like variant demos (matches common Tabs examples). */
const threeSectionItems = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

const threeSectionItemsWithIcons = [
  {
    id: "overview",
    label: "Overview",
    icon: <Icon name="file-text" variant="clear" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <Icon name="chart-column" variant="clear" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Icon name="settings-2" variant="clear" />,
  },
];

export const Playground: Story = {
  args: {
    items: monthItems,
    defaultValue: "this",
    "aria-label": "Reporting period",
  },
};

/** Matches Abacus App Shell main — “This month / Last month” (Figma node \`107:177\`). */
export const AbacusPeriodFilter: Story = {
  name: "Abacus / Period filter",
  args: {
    items: monthItems,
    defaultValue: "this",
    "aria-label": "Reporting period",
  },
};

export const ThreeOptions: Story = {
  args: {
    items: [
      { id: "day", label: "Day" },
      { id: "week", label: "Week" },
      { id: "month", label: "Month" },
    ],
    defaultValue: "week",
    "aria-label": "Chart granularity",
  },
};

export const FourOptions: Story = {
  args: {
    items: [
      { id: "q1", label: "Q1" },
      { id: "q2", label: "Q2" },
      { id: "q3", label: "Q3" },
      { id: "q4", label: "Q4" },
    ],
    defaultValue: "q1",
    "aria-label": "Fiscal quarter",
  },
};

export const Disabled: Story = {
  args: {
    items: monthItems,
    defaultValue: "this",
    disabled: true,
    "aria-label": "Reporting period",
  },
};

export const IndividualOptionDisabled: Story = {
  args: {
    items: [
      { id: "this", label: "This month" },
      { id: "last", label: "Last month", disabled: true },
    ],
    defaultValue: "this",
    "aria-label": "Reporting period",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("this");
    return (
      <div className="flex w-full flex-col gap-3">
        <SegmentedControl
          items={monthItems}
          value={value}
          onValueChange={setValue}
          aria-label="Reporting period"
        />
        <p className="text-text-on-muted text-xs leading-4">Selected id: {value}</p>
      </div>
    );
  },
};

/** Explicit `variant="segmented"` (muted track + sliding thumb); same visuals as Abacus period filter with three options. */
export const VariantSegmented: Story = {
  name: "Variants / Segmented",
  args: {
    variant: "segmented",
    items: threeSectionItems,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

/** Tab-like strip as a radiogroup (same tokens as `Tabs` `variant="default"`). */
export const VariantUnderline: Story = {
  name: "Variants / Underline",
  args: {
    variant: "underline",
    listUnderlineDivider: true,
    items: threeSectionItems,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantPill: Story = {
  name: "Variants / Pill",
  args: {
    variant: "pill",
    items: threeSectionItems,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantBoxed: Story = {
  name: "Variants / Boxed",
  args: {
    variant: "boxed",
    items: threeSectionItems,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantVertical: Story = {
  name: "Variants / Vertical",
  args: {
    variant: "vertical",
    items: threeSectionItems,
    defaultValue: "overview",
    "aria-label": "Section",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[220px] w-[min(100vw-2rem,390px)] items-start justify-center">
        <Story />
      </div>
    ),
  ],
};

export const VariantCompact: Story = {
  name: "Variants / Compact",
  args: {
    variant: "compact",
    items: threeSectionItems,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantSegmentedWithIcons: Story = {
  name: "Variants / Segmented · with icons",
  args: {
    variant: "segmented",
    items: threeSectionItemsWithIcons,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantUnderlineWithIcons: Story = {
  name: "Variants / Underline · with icons",
  args: {
    variant: "underline",
    listUnderlineDivider: true,
    items: threeSectionItemsWithIcons,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantPillWithIcons: Story = {
  name: "Variants / Pill · with icons",
  args: {
    variant: "pill",
    items: threeSectionItemsWithIcons,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantBoxedWithIcons: Story = {
  name: "Variants / Boxed · with icons",
  args: {
    variant: "boxed",
    items: threeSectionItemsWithIcons,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};

export const VariantVerticalWithIcons: Story = {
  name: "Variants / Vertical · with icons",
  args: {
    variant: "vertical",
    items: threeSectionItemsWithIcons,
    defaultValue: "overview",
    "aria-label": "Section",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[220px] w-[min(100vw-2rem,390px)] items-start justify-center">
        <Story />
      </div>
    ),
  ],
};

export const VariantCompactWithIcons: Story = {
  name: "Variants / Compact · with icons",
  args: {
    variant: "compact",
    items: threeSectionItemsWithIcons,
    defaultValue: "overview",
    "aria-label": "Section",
  },
};
