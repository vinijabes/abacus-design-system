import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@design-system/icon";
import { Input, InputContainer } from "./Input";

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

export const FieldOnly: Story = {
  render: () => (
    <InputContainer leading="icon" state="default">
      <Icon
        name="search"
        size="sm"
        variant="clear"
        className="text-zinc-400"
        aria-hidden
      />
      <input
        placeholder="0.00"
        className="w-full min-w-0 border-0 bg-transparent p-0 text-sm leading-normal text-text-on-background outline-none placeholder:text-text-input-placeholder"
      />
    </InputContainer>
  ),
};

export const DesignStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-10 gap-y-20">
      <Input
        label="Amount"
        placeholder="0.00"
        state="default"
        leading="none"
      />
      <Input
        label="Amount"
        placeholder="0.00"
        state="default"
        leading="icon"
      />

      <Input
        label="Amount"
        placeholder="0.00"
        state="disabled"
        leading="none"
      />
      <Input
        label="Amount"
        placeholder="0.00"
        state="disabled"
        leading="icon"
      />

      <Input label="Amount" value="0.00" state="readOnly" leading="none" />
      <Input label="Amount" value="0.00" state="readOnly" leading="icon" />
    </div>
  ),
};
