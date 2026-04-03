import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";

const meta = {
  title: "Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "clear", "ghost"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "destructive",
        "info",
      ],
    },
  },
  args: {
    name: "dollar-sign",
    size: "md",
    variant: "solid",
    color: "primary",
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariantsPrimary: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Icon name="dollar-sign" variant="solid" color="primary" size="lg" />
      <Icon name="dollar-sign" variant="outline" color="primary" size="lg" />
      <Icon name="dollar-sign" variant="clear" color="primary" size="lg" />
      <Icon name="dollar-sign" variant="ghost" color="primary" size="lg" />
    </div>
  ),
};

export const SemanticColorsSolid: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Icon name="check" variant="solid" color="primary" size="md" />
      <Icon name="check" variant="solid" color="success" size="md" />
      <Icon name="alert-triangle" variant="solid" color="warning" size="md" />
      <Icon name="x" variant="solid" color="destructive" size="md" />
      <Icon name="info" variant="solid" color="info" size="md" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Icon name="star" variant="solid" color="primary" size="sm" />
      <Icon name="star" variant="solid" color="primary" size="md" />
      <Icon name="star" variant="solid" color="primary" size="lg" />
      <Icon name="star" variant="solid" color="primary" size="xl" />
    </div>
  ),
};
