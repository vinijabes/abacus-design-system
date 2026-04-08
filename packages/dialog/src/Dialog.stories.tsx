import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@design-system/button";
import { fn } from "storybook/test";
import { useState, type ComponentProps } from "react";
import { Dialog } from "./Dialog";

const meta = {
  title: "Dialog",
  component: Dialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs", "test"],
  decorators: [
    (Story) => (
      <div className="h-[520px] w-full">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "confirmation",
        "form",
        "alert",
        "success",
        "fullWidth",
      ],
    },
  },
  args: {
    onPrimaryAction: fn(),
    onSecondaryAction: fn(),
    onBackdropClick: fn(),
    onCloseButtonClick: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDialog(args: ComponentProps<typeof Dialog>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative size-full">
      <div className="p-6">
        <Button type="button" variant="primary" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
      </div>
      <Dialog
        {...args}
        open={open}
        onBackdropClick={() => {
          args.onBackdropClick?.();
          setOpen(false);
        }}
        onCloseButtonClick={() => {
          args.onCloseButtonClick?.();
          setOpen(false);
        }}
        onPrimaryAction={() => {
          args.onPrimaryAction?.();
          setOpen(false);
        }}
        onSecondaryAction={() => {
          args.onSecondaryAction?.();
          setOpen(false);
        }}
      />
    </div>
  );
}

export const Playground: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "default",
    open: false,
    title: "Dialog Title",
    body: "This is the dialog content. You can place any content here including forms, text, or other components.",
    primaryActionLabel: "Confirm",
    secondaryActionLabel: "Cancel",
  },
};

export const Default: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "default",
    open: false,
    title: "Dialog Title",
    body: "This is the dialog content. You can place any content here including forms, text, or other components.",
    primaryActionLabel: "Confirm",
    secondaryActionLabel: "Cancel",
  },
};

export const Confirmation: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "confirmation",
    open: false,
    title: "Confirm Action",
    statusText: "Are you sure? This action cannot be undone.",
    statusTone: "warning",
    primaryActionLabel: "Confirm",
    secondaryActionLabel: "Cancel",
  },
};

export const Form: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "form",
    open: false,
    title: "Add New Item",
    body: "Provide the required details below.",
    fieldLabel: "Name",
    fieldPlaceholder: "Enter name",
    primaryActionLabel: "Save",
    secondaryActionLabel: "Cancel",
  },
};

export const Alert: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "alert",
    open: false,
    title: "Error Occurred",
    statusText: "An error occurred while processing your request.",
    statusTone: "error",
    primaryActionLabel: "Okay",
  },
};

export const Success: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "success",
    open: false,
    title: "Success",
    statusText: "Action completed successfully.",
    statusTone: "success",
    primaryActionLabel: "Continue",
  },
};

export const FullWidth: Story = {
  render: (args) => <InteractiveDialog {...args} />,
  args: {
    variant: "fullWidth",
    open: false,
    title: "Settings",
    body: "Complex content requiring more horizontal space.",
    primaryActionLabel: "Save Changes",
    secondaryActionLabel: "Cancel",
  },
};

export const BodyOnlyOverlay: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="mx-auto flex h-[520px] w-full max-w-[960px] flex-col overflow-hidden rounded-lg border border-solid border-border-color bg-bg-background">
        <header className="border-b border-solid border-border-color bg-input-background px-6 py-4">
          <p className="text-sm font-medium text-text-on-background">Page Header</p>
        </header>

        <main className="relative flex-1 bg-bg-muted p-6">
          <div className="mb-4">
            <Button type="button" variant="primary" onClick={() => setOpen(true)}>
              Open dialog in body
            </Button>
          </div>
          <p className="text-sm text-text-on-muted">
            The dialog backdrop should cover only this body area.
          </p>

          <Dialog
            {...args}
            open={open}
            onBackdropClick={() => {
              args.onBackdropClick?.();
              setOpen(false);
            }}
            onCloseButtonClick={() => {
              args.onCloseButtonClick?.();
              setOpen(false);
            }}
            onPrimaryAction={() => {
              args.onPrimaryAction?.();
              setOpen(false);
            }}
            onSecondaryAction={() => {
              args.onSecondaryAction?.();
              setOpen(false);
            }}
          />
        </main>

        <footer className="border-t border-solid border-border-color bg-input-background px-6 py-4">
          <p className="text-sm text-text-on-muted">Page Footer</p>
        </footer>
      </div>
    );
  },
  args: {
    variant: "default",
    open: false,
    title: "Dialog Title",
    body: "This dialog is constrained to the page body area.",
    primaryActionLabel: "Confirm",
    secondaryActionLabel: "Cancel",
  },
};
