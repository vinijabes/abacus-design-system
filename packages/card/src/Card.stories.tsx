import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@design-system/button";
import { Typography } from "@design-system/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

const meta = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="w-[min(100%,560px)]">
      <Card>
        <CardContent>
          <Typography category="Body" size="M">
            This is a basic card with just content. No header or footer.
          </Typography>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <div className="w-[min(100%,560px)]">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            Card description or subtitle goes here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Typography category="Body" size="M">
            This card has a header with a title and description, making it clear
            what the card contains.
          </Typography>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <div className="w-[min(100%,560px)]">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Action</CardTitle>
          <CardDescription>
            This action requires your confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Typography category="Body" size="M">
            This card has a header with a title and description, making it clear
            what the card contains.
          </Typography>
        </CardContent>
        <CardFooter>
          <Button type="button" variant="outline" size="md">
            Cancel
          </Button>
          <Button type="button" variant="primary" size="md">
            Confirm
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
