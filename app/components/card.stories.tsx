import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "~/components/button";
import { Card, CardFooter } from "~/components/card";
import { FormField } from "~/components/form-field";
import { LockIcon } from "~/components/icon";
import { TextInput } from "~/components/text-input";

export default {
  title: "Components/Card",
  component: Card,
  args: {
    className: "w-96 min-h-64",
    children: (
      <>
        <FormField
          label="Email"
          helperText="We never use your email for marketing reason."
          name="email"
        >
          <TextInput
            inputProps={{ type: "email", placeholder: "your@email.com" }}
            className="w-full"
          />
        </FormField>

        <FormField
          label="Password"
          helperText="Needs more than 8 characters and including at least one alphabet and one numeric chracter."
          name="password"
          className="mt-6"
        >
          <TextInput
            prefix={<LockIcon className="w-5 h-5" />}
            inputProps={{ type: "password" }}
            className="w-full"
          />
        </FormField>

        <CardFooter>
          <Button>Create Account</Button>
        </CardFooter>
      </>
    ),
  },
} as ComponentMeta<typeof Card>;

export const Example: ComponentStory<typeof Card> = (args) => (
  <Card {...args} />
);
