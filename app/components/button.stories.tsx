import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button, GhostButton } from "~/components/button";

export default {
  title: "Components/Button",
  component: Button,
  args: {
    variant: "primary",
    disabled: false,
    children: "Press Me",
  },
} as ComponentMeta<typeof Button>;

export const Example: ComponentStory<typeof Button> = (args) => (
  <Button {...args} />
);

export const Ghost: ComponentStory<typeof GhostButton> = (args) => (
  <GhostButton {...args} />
);

export const GhostGrayInitially: ComponentStory<typeof GhostButton> = (
  args
) => <GhostButton {...args} />;
GhostGrayInitially.args = {
  grayInitially: true,
};
