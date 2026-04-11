import type { Meta, StoryObj } from "@storybook/react";
import { StackedProgressBar } from "./StackedProgressBar";

const meta = {
  title: "ProgressBar/StackedProgressBar",
  component: StackedProgressBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["solid", "subtle"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StackedProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const demo302050 = [
  { percent: 30, color: "success" as const, label: "Done" },
  { percent: 50, color: "primary" as const, label: "In progress" },
  { percent: 20, color: "warning" as const, label: "Queued" },
];

export const Playground: Story = {
  args: {
    label: "Sprint scope",
    segments: demo302050,
    size: "md",
    variant: "solid",
  },
};

export const ThirtyFiftyTwenty: Story = {
  name: "30% / 50% / 20% (semantic colors)",
  render: () => (
    <div className="flex flex-col gap-6">
      <StackedProgressBar
        label="Resource mix"
        segments={demo302050}
        size="md"
        variant="solid"
      />
      <StackedProgressBar
        label="Subtle track"
        segments={demo302050}
        size="md"
        variant="subtle"
      />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <StackedProgressBar
          key={size}
          label={size.toUpperCase()}
          segments={demo302050}
          size={size}
          variant="solid"
        />
      ))}
    </div>
  ),
};

export const NormalizedWhenSumNot100: Story = {
  name: "Auto-normalize (15 + 25 + 10 → 30% · 50% · 20%)",
  render: () => (
    <StackedProgressBar
      label="Weights normalized"
      segments={[
        { percent: 15, color: "success", label: "A" },
        { percent: 25, color: "info", label: "B" },
        { percent: 10, color: "destructive", label: "C" },
      ]}
      size="md"
    />
  ),
};

export const CustomSegmentStyles: Story = {
  name: "Custom segment colors (tokens)",
  render: () => (
    <StackedProgressBar
      label="Custom fills"
      valueLabel="3 segments"
      segments={[
        {
          percent: 30,
          color: "success",
          style: { backgroundColor: "var(--color-bg-primary)" },
        },
        {
          percent: 50,
          color: "primary",
          style: { backgroundColor: "var(--color-success)" },
        },
        {
          percent: 20,
          color: "warning",
          style: { backgroundColor: "var(--color-text-on-muted)" },
        },
      ]}
      size="lg"
    />
  ),
};

export const BarOnly: Story = {
  args: {
    hideLabelRow: true,
    segments: demo302050,
    size: "sm",
    variant: "solid",
    "aria-label": "Tasks by status: 30% done, 50% in progress, 20% queued",
  },
};
