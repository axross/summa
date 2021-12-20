import { zodResolver } from "@hookform/resolvers/zod";
import { action } from "@storybook/addon-actions";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextInput } from "~/components/text-input";

export default {
  title: "Components/TextInput",
  component: TextInput,
  args: {},
} as ComponentMeta<typeof TextInput>;

export const Example: ComponentStory<typeof TextInput> = (args) => (
  <TextInput {...args} />
);

export const WithPrefix = Example.bind({});
WithPrefix.args = {
  prefix: "http://",
};

export const WithSuffix = Example.bind({});
WithSuffix.args = {
  suffix: "@gmail.com",
};

export const WithBothPrefixAndSuffix = Example.bind({});
WithBothPrefixAndSuffix.args = {
  prefix: "https://",
  suffix: ".kohei.dev",
};

export const Invalid = Example.bind({});
Invalid.args = {
  inputProps: {
    "aria-invalid": true,
  },
};

const FormInput = z.object({
  email: z.string().email("Please type a valid email."),
});

export const WithHookForm: ComponentStory<typeof TextInput> = (args) => {
  const { register, handleSubmit } = useForm<z.infer<typeof FormInput>>({
    mode: "onTouched",
    shouldUseNativeValidation: true,
    defaultValues: { email: "yo@kohei.dev" },
    resolver: zodResolver(FormInput),
  });

  return (
    <form noValidate onSubmit={handleSubmit(action("onSubmit"))}>
      <TextInput {...args} inputProps={{ ...register("email") }} />
    </form>
  );
};
WithHookForm.args = {};
