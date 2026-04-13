import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Button } from "@design-system/button";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "test"],
  argTypes: {
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg"],
    },
    orientation: {
      control: "select",
      options: ["responsive", "horizontal", "vertical"],
    },
    inlineFrom: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    gap: "sm",
    orientation: "responsive",
    inlineFrom: "sm",
    "aria-label": "Example actions",
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-[26rem]">
      <ButtonGroup {...args}>
        <Button variant="outline">Back</Button>
        <Button variant="secondary">Save draft</Button>
        <Button>Submit</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Submit" })).toBeVisible();
  },
};

export const ResponsiveNarrowVsWide: Story = {
  name: "Responsive (narrow vs wide container)",
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm text-text-on-muted">
          Narrow container (~240px) — stacked, full width
        </p>
        <div className="w-[240px] rounded-md border border-border-color p-3">
          <ButtonGroup gap="md" aria-label="Narrow actions">
            <Button variant="outline">Cancel</Button>
            <Button>Continue</Button>
          </ButtonGroup>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-on-muted">
          Wide container (≥ default sm breakpoint, ~24rem) — inline row
        </p>
        <div className="w-[420px] max-w-full rounded-md border border-border-color p-3">
          <ButtonGroup gap="md" aria-label="Wide actions">
            <Button variant="outline">Cancel</Button>
            <Button>Continue</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
};

export const FixedHorizontal: Story = {
  args: {
    orientation: "horizontal",
    gap: "sm",
    "aria-label": "Toolbar actions",
  },
  render: (args) => (
    <div className="w-[220px] rounded-md border border-border-color p-3">
      <ButtonGroup {...args}>
        <Button size="sm" variant="ghost">
          One
        </Button>
        <Button size="sm" variant="ghost">
          Two
        </Button>
        <Button size="sm" variant="ghost">
          Three
        </Button>
      </ButtonGroup>
    </div>
  ),
};
