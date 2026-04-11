import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Icon } from "@design-system/icon";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs", "test"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["solid", "subtle", "striped"],
    },
    color: {
      control: "select",
      options: [
        "success",
        "primary",
        "warning",
        "destructive",
        "info",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Progress",
    value: 62,
    size: "md",
    variant: "solid",
    color: "success",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("progressbar")).toBeVisible();
  },
};

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export const SizesSolid: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <ProgressBar
          key={size}
          size={size}
          variant="solid"
          label={`${size.toUpperCase()}`}
          value={size === "xs" ? 75 : size === "sm" ? 60 : size === "md" ? 45 : size === "lg" ? 85 : 30}
        />
      ))}
    </div>
  ),
};

export const SizesSubtle: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {sizes.map((size) => (
        <ProgressBar
          key={size}
          size={size}
          variant="subtle"
          label={`${size.toUpperCase()}`}
          value={size === "xs" ? 90 : size === "sm" ? 50 : size === "md" ? 70 : size === "lg" ? 40 : 95}
        />
      ))}
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      {(
        [
          "success",
          "primary",
          "warning",
          "destructive",
          "info",
        ] as const
      ).map((color) => (
        <ProgressBar
          key={color}
          color={color}
          variant="solid"
          label={color}
          value={55 + color.length * 5}
        />
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ProgressBar
        variant="solid"
        size="md"
        label="Revenue Goal"
        value={75}
        valueLabel="$75K / $100K"
        leadingIcon={<Icon name="dollar-sign" aria-hidden />}
      />
      <ProgressBar
        variant="subtle"
        size="md"
        striped
        label="Team Members"
        value={60}
        valueLabel="12 / 20"
        leadingIcon={<Icon name="users" aria-hidden />}
      />
      <ProgressBar
        variant="solid"
        size="lg"
        label="Growth Target"
        value={45}
        leadingIcon={<Icon name="trending-up" aria-hidden />}
      />
    </div>
  ),
};

export const StripedAndIndeterminate: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ProgressBar
        variant="striped"
        size="md"
        label="Processing"
        valueLabel="Loading..."
        value={65}
      />
      <ProgressBar
        variant="subtle"
        striped
        size="lg"
        label="Upload Progress"
        value={82}
      />
      <ProgressBar
        variant="striped"
        size="xl"
        label="Download"
        value={38}
      />
      <ProgressBar
        variant="solid"
        size="md"
        label="Indeterminate"
        valueLabel="Loading..."
        aria-label="Task in progress"
      />
    </div>
  ),
};

export const DynamicTokens: Story = {
  name: "Dynamic colors (tokens)",
  render: () => (
    <ProgressBar
      label="Custom palette"
      value={72}
      tokens={{
        track: "var(--color-neutral-200)",
        indicator: "var(--color-brand-600)",
        valueText: "var(--color-brand-700)",
      }}
      hideLabelRow={false}
    />
  ),
};

export const BarOnly: Story = {
  args: {
    value: 40,
    hideLabelRow: true,
    variant: "solid",
    size: "sm",
    "aria-label": "Completion",
  },
};
