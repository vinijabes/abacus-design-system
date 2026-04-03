import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
  Typography,
  type TypographyCategory,
  type TypographySize,
} from "./Typography";

const meta = {
  title: "Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs", "test"],
  argTypes: {
    category: {
      control: "select",
      options: ["Heading", "Label", "Body"],
    },
    size: {
      control: "select",
      options: ["XL", "L", "M", "XS"],
    },
    as: { control: false },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleByCombo: Record<
  TypographyCategory,
  Record<TypographySize, string>
> = {
  Heading: {
    XL: "Heading 1 — Page title",
    L: "Heading 2 — Section title",
    M: "Heading 3 — Subsection",
    XS: "Heading 4 — Minor heading",
  },
  Body: {
    XL:
      "Large text — Use for emphasis or introductory paragraphs. The quick brown fox jumps over the lazy dog.",
    L:
      "Base text — Default body size for most content. The quick brown fox jumps over the lazy dog.",
    M:
      "Small text — Captions and secondary content. The quick brown fox jumps over the lazy dog.",
    XS:
      "Extra small — Timestamps, fine print, tertiary information.",
  },
  Label: {
    XL: "Label XL",
    L: "Label L",
    M: "Label M",
    XS: "Label XS",
  },
};

export const Playground: Story = {
  args: {
    category: "Heading",
    size: "XL",
  },
  render: (args) => (
    <Typography category={args.category} size={args.size} className={args.className}>
      {sampleByCombo[args.category ?? "Heading"][args.size ?? "XL"]}
    </Typography>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/Heading 1 — Page title/),
    ).toBeVisible();
  },
};

const categories: TypographyCategory[] = ["Heading", "Label", "Body"];
const sizes: TypographySize[] = ["XL", "L", "M", "XS"];

export const AllStyles: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-4">
          <Typography category="Label" size="XS">
            {category}
          </Typography>
          <div className="flex flex-col gap-3 border-t border-border-color pt-4">
            {sizes.map((size) => (
              <Typography key={`${category}-${size}`} category={category} size={size}>
                {sampleByCombo[category][size]}
              </Typography>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
