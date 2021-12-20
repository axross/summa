import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { MetaFunction, RouteComponent, useNavigate } from "remix";
import { z } from "zod";
import { Button } from "~/components/button";
import { Card, CardFooter } from "~/components/card";
import { FormField } from "~/components/form-field";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutHeaderTitle,
} from "~/components/layout";
import { TextInput } from "~/components/text-input";
import { useAuth } from "~/hooks/use-auth";
import { useMyUserUpdate } from "~/hooks/use-my-user-update";
import { UserName, UserUsername } from "~/models/user";

const FormInput = z.object({
  name: UserName,
  username: UserUsername,
});

export const meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

async function waitAtLeast<T>(
  promise: Promise<T>,
  duration: number
): Promise<T> {
  return (
    await Promise.all([
      promise,
      new Promise((resolve) => setTimeout(resolve, duration)),
    ])
  )[0];
}

const MySettingsPage: RouteComponent = () => {
  const { myself, deauthenticate } = useAuth();
  const { update } = useMyUserUpdate();
  const { register, handleSubmit, control, formState, reset } = useForm<
    z.infer<typeof FormInput>
  >({
    mode: "onTouched",
    defaultValues: {
      name: myself.name,
      username: myself.username,
    },
    resolver: zodResolver(FormInput),
  });

  return (
    <Layout myself={myself} onSignOutClick={deauthenticate}>
      <LayoutHeader>
        <LayoutHeaderTitle>Settings</LayoutHeaderTitle>
      </LayoutHeader>

      <LayoutContent>
        <div>
          <form
            noValidate
            onSubmit={handleSubmit(async ({ name, username }, e) => {
              e?.preventDefault();

              console.log("submit", { name, username });

              await waitAtLeast(update({ input: { name, username } }), 750);

              reset({ name, username });
            })}
          >
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-0 sm:px-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-50 dark:text-zinc-50">
                    Account
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                    Specify how the game will go.
                  </p>
                </div>
              </div>

              <Card className="flex flex-col mt-5 md:mt-0 md:col-span-2">
                <FormField
                  label="Name"
                  helperText="Your name to display."
                  name="name"
                  control={control}
                >
                  <TextInput
                    className="w-full"
                    inputProps={{
                      placeholder: "Lorem Ipsum",
                      ...register("name"),
                    }}
                  />
                </FormField>

                <FormField
                  label="Username"
                  helperText="The brief description for the game session."
                  name="username"
                  control={control}
                  className="mt-4"
                >
                  <TextInput
                    className="w-full"
                    prefix="@"
                    inputProps={{
                      placeholder: "loremipsum",
                      ...register("username"),
                    }}
                  />
                </FormField>

                <CardFooter>
                  <Button
                    disabled={!formState.isValid || !formState.isDirty}
                    loading={formState.isSubmitting}
                  >
                    Update
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>
      </LayoutContent>
    </Layout>
  );
};

export default MySettingsPage;
