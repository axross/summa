import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  LoadingSimplePlayerListRow,
  SimplePlayerList,
  SimplePlayerListEmptyRow,
  SimplePlayerListInputRow,
  SimplePlayerListRow,
  SimplePlayerListRowProps,
} from "~/components/simple-player-list";
import { TextInput } from "~/components/text-input";
import { errorToast } from "~/components/toast";
import { useAuth } from "~/hooks/use-auth";
import { useGameSessionCreate } from "~/hooks/use-game-session-create";
import { useUserByUsername } from "~/hooks/use-user";
import { GameSessionName } from "~/models/game-session";
import { User, UserUsername } from "~/models/user";

const FormInput = z.object({
  name: GameSessionName,
  rateDollarsString: z.string().regex(/^[1-9][0-9]+(\.[0-9]+)?$/),
  rateBbString: z.string().regex(/^[1-9][0-9]+$/),
  playerUsernames: z.array(UserUsername),
});

export const meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

const NewGameSessionPage: RouteComponent = () => {
  const navigate = useNavigate();
  const { myself, deauthenticate } = useAuth();
  const immediateStartElementId = React.useMemo(() => nanoid(), []);
  const { register, handleSubmit, control, formState } = useForm<
    z.infer<typeof FormInput>
  >({
    mode: "onTouched",
    defaultValues: {
      name: "",
      rateDollarsString: "20",
      rateBbString: "200",
      playerUsernames: [],
    },
    resolver: zodResolver(FormInput),
  });
  const { create } = useGameSessionCreate();
  const [isCreating, setCreating] = React.useState(false);

  return (
    <Layout myself={myself} onSignOutClick={deauthenticate}>
      <LayoutHeader>
        <LayoutHeaderTitle>New Game Session</LayoutHeaderTitle>
      </LayoutHeader>

      <LayoutContent>
        <form
          noValidate
          onSubmit={handleSubmit(
            async ({ name, rateDollarsString, rateBbString }, e) => {
              e?.preventDefault();

              const buyinBb = parseInt(rateBbString);
              const buyinDollars = parseFloat(rateDollarsString);
              const rate = buyinDollars / buyinDollars;

              setCreating(true);

              try {
                await create({ input: { name, buyinBb, rate } });
              } catch (error: unknown) {
                console.error(error);

                setCreating(false);

                return;
              }

              setCreating(false);

              navigate("/");
            }
          )}
        >
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-0 sm:px-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-50 dark:text-zinc-50">
                    Settings
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                    Specify how the game will go.
                  </p>
                </div>
              </div>

              <Card className="mt-5 md:mt-0 md:col-span-2">
                <FormField
                  label="Name"
                  helperText="The brief description for the game session."
                  name="name"
                  control={control}
                >
                  <TextInput
                    className="w-full"
                    inputProps={{
                      placeholder: "Friday Poker Night #123",
                      ...register("name"),
                    }}
                  />
                </FormField>

                <FormField
                  label="Rate"
                  helperText="The conversion rate between real money and poker chips."
                  name={["rateDollarsString", "rateBbString"]}
                  control={control}
                >
                  <div className="grid grid-cols-3">
                    <div className="flex items-center col-span-3 space-x-2">
                      <TextInput
                        prefix="$"
                        inputProps={{
                          type: "number",
                          ...register("rateDollarsString"),
                        }}
                      />

                      <span className="text-sm text-slate-700 dark:text-zinc-300">
                        per
                      </span>

                      <TextInput
                        suffix="BB"
                        inputProps={{
                          type: "number",
                          ...register("rateBbString"),
                        }}
                      />
                    </div>
                  </div>
                </FormField>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-0 sm:px-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-zinc-50">
                    Players
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                    Who do you want to play with?
                  </p>
                </div>
              </div>

              <Card className="mt-5 md:mt-0 md:col-span-2">
                <Controller
                  name="playerUsernames"
                  control={control}
                  render={({ field: { value: usernames, onChange } }) => (
                    <SimplePlayerList>
                      {usernames.length >= 1 ? (
                        usernames.map((username, i) => (
                          <ConnectedSimplePlayerListRow
                            username={username}
                            onRemoveClick={() => {
                              onChange(
                                usernames.filter((un) => un !== username)
                              );
                            }}
                            className={
                              i !== 0
                                ? "border-t border-slate-300 dark:border-zinc-700"
                                : undefined
                            }
                            key={username}
                          />
                        ))
                      ) : (
                        <SimplePlayerListEmptyRow />
                      )}

                      <SimplePlayerListInputRow
                        onPressEnter={(_, un) => {
                          onChange(
                            usernames.includes(un)
                              ? usernames
                              : [...usernames, un]
                          );
                        }}
                        className="border-t border-slate-300 dark:border-zinc-700"
                      />
                    </SimplePlayerList>
                  )}
                />
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-0 sm:px-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-zinc-50">
                    Create
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                    Now finally create the session!
                  </p>
                </div>
              </div>

              <Card className="mt-5 md:mt-0 md:col-span-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={immediateStartElementId}
                      type="checkbox"
                      disabled
                      checked
                      className="h-4 w-4 border-slate-300 dark:border-zinc-700 rounded focus:ring-indigo-500 text-indigo-600 disabled:text-zinc-300 dark:disabled:text-zinc-700"
                    />
                  </div>

                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={immediateStartElementId}
                      className="text-slate-700 dark:text-zinc-300 font-medium"
                    >
                      Start Immediately (alpha)
                    </label>

                    <p className="text-slate-500">
                      The game session will be considered as "ongoing"
                      immediately.
                    </p>
                  </div>
                </div>

                <CardFooter>
                  <Button
                    disabled={!formState.isValid}
                    loading={isCreating || formState.isValidating}
                  >
                    Create and Start
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </LayoutContent>
    </Layout>
  );
};

interface ConnectedSimplePlayerListRowProps
  extends Omit<SimplePlayerListRowProps, "user"> {
  username: User["username"];
}

const ConnectedSimplePlayerListRow: React.VFC<
  ConnectedSimplePlayerListRowProps
> = ({ username, ...props }) => {
  const { user, isLoading, error } = useUserByUsername({ username });

  React.useEffect(() => {
    if (error) {
      errorToast({
        title: "Invalid Username",
        description: `@${username} is an invalid username. Please remove`,
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSimplePlayerListRow {...props} />;
  }

  if (!user) {
    return <LoadingSimplePlayerListRow {...props} />;
  }

  return <SimplePlayerListRow user={user} {...props} />;
};

export default NewGameSessionPage;
