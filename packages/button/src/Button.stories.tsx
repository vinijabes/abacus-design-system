import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Icon } from "@design-system/icon";
import { Typography } from "@design-system/typography";
import { Button } from "./Button";
import { FloatingActionButton } from "./FloatingActionButton";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "test"],
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
        "fab",
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Button" })).toBeVisible();
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
      <Typography category="Body" size="M" className="text-text-on-muted">
        Disabled
      </Typography>
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

export const IconButton: Story = {
  args: {
    size: "icon",
    variant: "primary",
    children: (
      <Icon name="plus" size="sm" variant="clear" color="inherit" aria-hidden />
    ),
    "aria-label": "Add",
  },
};

const fabPlusIcon = (
  <Icon name="plus" size="md" variant="clear" color="inherit" aria-hidden />
);

/** Matches [Abacus App Shell FAB](https://www.figma.com/design/y70O9MsPCJeRCOJS8YGpCp/Abacus?node-id=107-177) — 56×56, primary, `shadow-lg`. */
export const FabDefault: Story = {
  name: "FAB / Default",
  render: () => (
    <FloatingActionButton type="button" aria-label="Create">
      {fabPlusIcon}
    </FloatingActionButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Create" }),
    ).toBeVisible();
  },
};

export const FabDisabled: Story = {
  name: "FAB / Disabled",
  render: () => (
    <FloatingActionButton type="button" aria-label="Create" disabled>
      {fabPlusIcon}
    </FloatingActionButton>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Create" })).toBeDisabled();
  },
};

export const FabWithPlus: Story = {
  name: "FAB / With plus",
  render: () => (
    <Button type="button" variant="fab" aria-label="Create">
      {fabPlusIcon}
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Create" }),
    ).toBeVisible();
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
