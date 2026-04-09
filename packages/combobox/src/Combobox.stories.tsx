import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  Combobox,
  ComboboxMenu,
  ComboboxMenuItem,
  type ComboboxState,
} from "./index";

const demoOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
];

const states: ComboboxState[] = [
  "default",
  "hover",
  "focused",
  "open",
  "disabled",
  "error",
  "selected",
  "loading",
];

const triggerStates = states.filter((state) => state !== "open");

const meta = {
  title: "Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "test"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    state: {
      control: "select",
      options: states,
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();

    return (
      <Combobox
        {...args}
        value={value}
        onValueChange={(nextValue) => {
          updateArgs({ value: nextValue });
        }}
      />
    );
  },
  args: {
    size: "sm",
    placeholder: "Select option",
    options: demoOptions,
    value: undefined,
  },
};

export const TriggerStates: Story = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {triggerStates.map((state) => (
            <Combobox
              key={`sm-${state}`}
              size="sm"
              state={state}
              options={demoOptions}
              value={state === "selected" ? "us" : undefined}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {triggerStates.map((state) => (
            <Combobox
              key={`md-${state}`}
              size="md"
              state={state}
              options={demoOptions}
              value={state === "selected" ? "us" : undefined}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {triggerStates.map((state) => (
            <Combobox
              key={`lg-${state}`}
              size="lg"
              state={state}
              options={demoOptions}
              value={state === "selected" ? "us" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Menu: Story = {
  render: () => (
    <div className="w-[360px]">
      <ComboboxMenu>
        {demoOptions.map((option) => (
          <ComboboxMenuItem key={option.value} label={option.label} />
        ))}
      </ComboboxMenu>
    </div>
  ),
};

export const MenuItemStates: Story = {
  render: () => (
    <div className="w-[352px]">
      <ComboboxMenuItem label="Option label" state="default" />
      <ComboboxMenuItem label="Option label" state="hover" />
      <ComboboxMenuItem label="Option label" state="selected" />
      <ComboboxMenuItem label="Option label" state="disabled" />
    </div>
  ),
};
