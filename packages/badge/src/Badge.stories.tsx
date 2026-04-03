import { Fragment } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "@design-system/typography";
import { Badge } from "./Badge";

const meta = {
  title: "Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "destructive",
        "success",
        "warning",
        "info",
      ],
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "subtle"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "Default",
    color: "primary",
    variant: "solid",
  },
};

const colors = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
] as const;

const variants = ["solid", "outline", "subtle"] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] items-center gap-x-4 gap-y-3">
        <span className="text-text-on-muted" aria-hidden />
        {variants.map((v) => (
          <Typography
            key={v}
            category="Label"
            size="M"
            className="text-text-on-muted capitalize"
          >
            {v}
          </Typography>
        ))}
        {colors.map((color) => (
          <Fragment key={color}>
            <Typography
              category="Label"
              size="M"
              className="text-text-on-muted capitalize"
            >
              {color}
            </Typography>
            {variants.map((variant) => (
              <Badge key={variant} color={color} variant={variant}>
                Default
              </Badge>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  ),
};

export const Customization: Story = {
  render: () => (
    <Badge
      color="secondary"
      variant="outline"
      className="shadow-sm"
      data-testid="custom-badge"
    >
      Styled + attributes
    </Badge>
  ),
};
