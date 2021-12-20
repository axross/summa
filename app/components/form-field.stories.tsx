import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "~/components/form-field";
import { TextInput } from "~/components/text-input";

export default {
  title: "Components/FormField",
  component: FormField,
  args: {
    label: "Email",
    helperText:
      "Your email will be used only for authentication. We never use your email for marketing reason.",
  },
} as ComponentMeta<typeof FormField>;

const FormInput = z.object({
  email: z.string().email("Please type a valid email."),
});

export const Example: ComponentStory<typeof FormField> = (args) => {
  return (
    <FormField {...args}>
      <TextInput inputProps={{ type: "email" }} />
    </FormField>
  );
};

export const Invalid = Example.bind({});
Invalid.args = {
  errorText: "Please type a valid email.",
};

export const MultipleChildren: ComponentStory<typeof FormField> = (args) => {
  return (
    <FormField {...args}>
      <TextInput inputProps={{ type: "number" }} />

      <span className="text-gray-700 text-sm">per</span>

      <TextInput inputProps={{ type: "number" }} />

      <span className="text-gray-700 text-sm">at</span>

      <TextInput inputProps={{ type: "text" }} />
    </FormField>
  );
};
MultipleChildren.args = {
  label: "Ratio",
};

export const InvalidMultipleChildren: ComponentStory<typeof FormField> = (
  args
) => {
  return (
    <FormField {...args}>
      <TextInput inputProps={{ type: "number" }} />

      <span className="text-gray-700 text-sm">per</span>

      <TextInput inputProps={{ type: "number" }} />

      <span className="text-gray-700 text-sm">at</span>

      <TextInput inputProps={{ type: "text" }} />
    </FormField>
  );
};
InvalidMultipleChildren.args = {
  label: "Ratio",
  errorText: "Please type a valid email.",
};

export const Controlled: ComponentStory<typeof FormField> = (args) => {
  const { control, register } = useForm<z.infer<typeof FormInput>>({
    mode: "onTouched",
    defaultValues: { email: "yo@kohei.dev" },
    resolver: zodResolver(FormInput),
  });

  return (
    <FormField control={control} name="email" {...args}>
      <TextInput inputProps={{ ...register("email"), type: "email" }} />
    </FormField>
  );
};
