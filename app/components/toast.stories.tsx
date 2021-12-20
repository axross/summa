import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ErrorToast } from "~/components/toast";

export default {
  title: "Components/Toast",
  component: ErrorToast,
  args: {
    title: "Oops!",
    description: "There's some server error happened.",
    className: "w-96",
  },
} as ComponentMeta<typeof ErrorToast>;

export const Error: ComponentStory<typeof ErrorToast> = (args) => (
  <ErrorToast {...args} />
);
