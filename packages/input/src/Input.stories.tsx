import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "test"],
  argTypes: {
    leading: {
      control: "select",
      options: ["none", "icon"],
    },
    state: {
      control: "select",
      options: ["default", "disabled", "readOnly"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    leading: "none",
    state: "default",
  },
};

export const DesignStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-10 gap-y-20">
      <Input label="Amount" placeholder="0.00" state="default" leading="none" />
      <Input label="Amount" placeholder="0.00" state="default" leading="icon" />

      <Input label="Amount" placeholder="0.00" state="disabled" leading="none" />
      <Input label="Amount" placeholder="0.00" state="disabled" leading="icon" />

      <Input label="Amount" value="0.00" state="readOnly" leading="none" />
      <Input label="Amount" value="0.00" state="readOnly" leading="icon" />
    </div>
  ),
};
