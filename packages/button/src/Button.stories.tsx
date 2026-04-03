import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    fullWidth: false,
  },
};

const variants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
      </div>
      <p className="text-text-on-muted text-sm">Disabled</p>
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((v) => (
          <Button key={v} variant={v} disabled>
            {v}
          </Button>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="md" variant="primary">
        Medium
      </Button>
      <Button size="lg" variant="primary">
        Large
      </Button>
    </div>
  ),
};

export const Icon: Story = {
  args: {
    size: "icon",
    variant: "primary",
    children: "+",
    "aria-label": "Add",
  },
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-64">
      <Button variant="primary" fullWidth>
        Continue
      </Button>
    </div>
  ),
};

export const Customization: Story = {
  render: () => (
    <Button
      variant="secondary"
      className="mt-2 shadow-md"
      data-testid="custom-button"
      aria-label="Custom labeled button"
    >
      Styled + attributes
    </Button>
  ),
};
