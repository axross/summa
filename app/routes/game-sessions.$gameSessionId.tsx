import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { MetaFunction, RouteComponent } from "remix";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { GhostButton } from "~/components/button";
import { Card } from "~/components/card";
import {
  ChartIcon,
  ClockIcon,
  DownIcon,
  FireIcon,
  MoneyIcon,
  RightIcon,
  StackIcon,
  UpIcon,
} from "~/components/icon";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutHeaderTitle,
} from "~/components/layout";
import {
  PlayerTable,
  PlayerTableInputRow,
  PlayerTableLoadingRow,
  PlayerTableRow,
  PlayerTableRowProps,
} from "~/components/player-table";
import { TextInput } from "~/components/text-input";
import { errorToast } from "~/components/toast";
import { useAuth } from "~/hooks/use-auth";
import { useGameSession } from "~/hooks/use-game-session";
import { useGameSessionPlayers } from "~/hooks/use-game-session-players";
import { useGameSessionPlayerUpdate } from "~/hooks/use-game-session-player-update";
import { useUserById } from "~/hooks/use-user";
import { GameSession } from "~/models/game-session";
import { GameSessionPlayer } from "~/models/game-session-player";

export const meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

const GameSessionDetailPage: RouteComponent = () => {
  const { gameSessionId } = useParams();
  const { myself, deauthenticate } = useAuth();
  const {
    gameSession,
    isLoading: isGameSessionLoading,
    error: gameSessionError,
  } = useGameSession({
    id: gameSessionId!,
  });
  const {
    players,
    isLoading: arePlayersLoading,
    error: playersError,
    addPlayer,
    removePlayer,
  } = useGameSessionPlayers({ id: gameSessionId! });

  React.useEffect(() => {
    if (gameSessionError || playersError) {
      errorToast({
        title: "Game Session Fetch Failed",
        description: `There was unknown error while fetching the game session. Please retry later`,
      });
    }
  }, [gameSessionError, playersError]);

  const myPlayer = players.find((p) => p.userId === myself.id) ?? null;

  if (isGameSessionLoading) {
    return (
      <Layout myself={myself} onSignOutClick={deauthenticate}>
        <LayoutHeader>
          <div className="w-4/12 y-7 mt72 bg-slate-300 rounded" />
        </LayoutHeader>

        <LayoutContent>
          <section className="w-full mt-8" key="players">
            <h2 className="text-slate-900 text-xl font-semibold">Players</h2>

            <PlayerTable className="mt-4">
              <PlayerTableLoadingRow />

              <PlayerTableLoadingRow />

              <PlayerTableLoadingRow />
            </PlayerTable>
          </section>
        </LayoutContent>
      </Layout>
    );
  }

  if (gameSession === null) {
    return (
      <Layout myself={myself} onSignOutClick={deauthenticate}>
        <LayoutContent className="flex flex-col items-center justify-center">
          <div className="text-blue-500 text-sm font-semibold">404 ERROR</div>

          <div className="mt-4 text-slate-900 dark:text-zinc-50 text-5xl font-bold">
            Page Not Found
          </div>

          <div className="mt-2 text-slate-500 dark:text-zinc-500">
            Sorry, we couldn't find the page you're looking for.
          </div>

          <GhostButton className="mt-4">
            Go back to dashboard <RightIcon />
          </GhostButton>
        </LayoutContent>
      </Layout>
    );
  }

  return (
    <Layout myself={myself} onSignOutClick={deauthenticate}>
      <Title gameSession={gameSession} players={players} />

      <LayoutContent>
        {myPlayer ? (
          <MyPlayerSummarySection
            myPlayer={myPlayer}
            gameSession={gameSession}
          />
        ) : null}

        <section className="w-full mt-8">
          <h2 className="text-slate-900 dark:text-zinc-100 text-xl font-semibold">
            Players
          </h2>

          <PlayerTable className="mt-4" key="players">
            {arePlayersLoading ? (
              <>
                <PlayerTableLoadingRow />
                <PlayerTableLoadingRow />
                <PlayerTableLoadingRow />
              </>
            ) : (
              <>
                {players.map((player) => (
                  <ConnectedPlayerTableRow
                    gameSession={gameSession}
                    player={player}
                    onRemoveClick={() => removePlayer(player.userId)}
                    key={player.userId}
                  />
                ))}

                <PlayerTableInputRow
                  onPressEnter={async (_, username) => {
                    try {
                      await addPlayer(username);
                    } catch (error) {
                      errorToast({
                        title: "User Not Found",
                        description: `@${username} isn't an invalid username.`,
                      });
                    }
                  }}
                />
              </>
            )}
          </PlayerTable>
        </section>
      </LayoutContent>
    </Layout>
  );
};

interface TitleProps {
  gameSession: GameSession;
  players: GameSessionPlayer[];
  className?: string;
  style?: React.CSSProperties;
}

const Title: React.VFC<TitleProps> = ({ gameSession, players, ...props }) => {
  return (
    <LayoutHeader {...props}>
      <LayoutHeaderTitle>{gameSession.name}</LayoutHeaderTitle>

      <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4">
        <div className="flex items-center gap-x-1">
          <ClockIcon className="h-5 w-5 text-slate-500 dark:text-zinc-500" />

          <span className="text-slate-500 dark:text-zinc-500 text-sm">
            {gameSession.endedAt
              ? `Ended ${formatDistanceToNow(gameSession.endedAt, {
                  addSuffix: true,
                })}`
              : `Started ${formatDistanceToNow(gameSession.startedAt, {
                  addSuffix: true,
                })}`}
          </span>
        </div>

        <div className="flex items-center gap-x-1">
          <MoneyIcon className="h-5 w-5 text-slate-500 dark:text-zinc-500" />

          <span className="text-slate-500 dark:text-zinc-500 text-sm">
            ${gameSession.rate * 100} per 100BB
          </span>
        </div>

        <div className="flex items-center gap-x-1">
          <ChartIcon className="h-5 w-5 text-slate-500 dark:text-zinc-500" />

          <span className="text-slate-500 dark:text-zinc-500 text-sm">
            {"Avarage "}
            {(
              players.reduce((sum, p) => sum + p.buyins, 0) / players.length
            ).toFixed(2)}
            {" re-buys"}
          </span>
        </div>
      </div>
    </LayoutHeader>
  );
};

const MyPlayerSummaryFormInput = z.object({
  stackBbString: z.string().regex(/^[1-9][0-9]+(\.[0-9]+)?$/),
});

interface MyPlayerSummarySectionProps {
  myPlayer: GameSessionPlayer;
  gameSession: GameSession;
  className?: string;
  style?: React.CSSProperties;
}

const MyPlayerSummarySection: React.VFC<MyPlayerSummarySectionProps> = ({
  myPlayer,
  gameSession,
  className,
  ...props
}) => {
  const { updateBuyins, updateStackBb } = useGameSessionPlayerUpdate({
    gameSessionId: gameSession.id,
    playerId: myPlayer.userId,
  });
  const { register, handleSubmit, formState, getValues } = useForm({
    mode: "onTouched",
    defaultValues: {
      stackBbString: `${myPlayer.stackBb}`,
    },
    resolver: zodResolver(MyPlayerSummaryFormInput),
  });
  const diffBb = myPlayer.stackBb - myPlayer.buyins * gameSession.buyinBb;

  const onStackBbStringSubmit = React.useCallback(
    async (stackBbString) => {
      const stackBb = parseFloat(stackBbString);

      try {
        await updateStackBb(stackBb);
      } catch (error) {
        errorToast({
          title: "Stack Update Failed",
          description: "Something went wrong. Try again later.",
        });
      }
    },
    [updateStackBb]
  );

  React.useEffect(() => {
    if (formState.isValid) {
      onStackBbStringSubmit(getValues("stackBbString"));
    }
  }, [formState, getValues, onStackBbStringSubmit]);

  const onBuyinIncrementClick = React.useCallback(async () => {
    try {
      await updateBuyins(myPlayer.buyins + 1);
    } catch (error) {
      errorToast({
        title: "Buyin Increment Failed",
        description: "Something went wrong. Please try again later.",
      });
    }
  }, [myPlayer, updateBuyins, errorToast]);

  const onBuyinDecrementClick = React.useCallback(async () => {
    try {
      await updateBuyins(myPlayer.buyins - 1);
    } catch (error) {
      errorToast({
        title: "Buyin Increment Failed",
        description: "Something went wrong. Please try again later.",
      });
    }
  }, [myPlayer, updateBuyins, errorToast]);

  return (
    <section className={twMerge("w-full", className)} {...props}>
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
        <Card className="flex space-x-4 p-6">
          <div
            className={twMerge(
              "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md",
              diffBb === 0 ? "bg-blue-500" : null,
              diffBb > 0 ? "bg-green-500" : null,
              diffBb < 0 ? "bg-red-500" : null
            )}
          >
            <MoneyIcon className="h-7 w-7 text-white" />
          </div>

          <div>
            <div className="text-slate-500 dark:text-zinc-500 text-sm font-medium">
              Total
            </div>

            <div className="flex flex-col items-end mt-1">
              <div className="text-slate-900 dark:text-zinc-100 text-3xl font-semibold">
                {diffBb < 0 ? "-$" : "$"}
                {(Math.abs(diffBb) * gameSession.rate).toFixed(2)}
              </div>

              <div className="flex items-center">
                {diffBb === 0 ? (
                  <RightIcon
                    strokeWidth={2}
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                ) : diffBb > 0 ? (
                  <UpIcon
                    strokeWidth={2}
                    className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                  />
                ) : (
                  <DownIcon
                    strokeWidth={2}
                    className="w-5 h-5 text-rose-600 dark:text-rose-400"
                  />
                )}

                <span
                  className={twMerge(
                    "text-sm font-medium",
                    diffBb === 0 ? "text-blue-600 dark:text-blue-400" : null,
                    diffBb > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : null,
                    diffBb < 0 ? "text-rose-600 dark:text-rose-400" : null
                  )}
                >
                  {((diffBb / gameSession.buyinBb) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex space-x-4 px-6 pt-6 pb-2">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-md">
            <FireIcon className="w-7 h-7 text-white" />
          </div>

          <div>
            <div className="text-slate-500 dark:text-zinc-500 text-sm font-medium">
              Re-buys
            </div>

            <div className="mt-1">
              <span className="text-slate-900 dark:text-zinc-100 text-3xl font-semibold">
                {myPlayer.buyins}
              </span>

              <span className="ml-1 text-slate-700 dark:text-zinc-300 font-medium">
                times
              </span>
            </div>

            <div className="flex items-center justify-end mt-2 space-x-2">
              <GhostButton variant="danger" onClick={onBuyinIncrementClick}>
                <UpIcon className="-ml-2" />
                +1
              </GhostButton>

              {myPlayer.buyins > 0 ? (
                <GhostButton
                  variant="successful"
                  onClick={onBuyinDecrementClick}
                >
                  <DownIcon className="-ml-2" />
                  -1
                </GhostButton>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="flex space-x-4 p-6">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-500 rounded-md">
            <StackIcon className="h-7 w-7 text-white" />
          </div>

          <div>
            <label
              htmlFor="my-stack-input"
              className="text-slate-500 dark:text-zinc-500 text-sm font-medium"
            >
              Current Stack
            </label>

            <div className="mt-1">
              <form
                onSubmit={handleSubmit((data) =>
                  onStackBbStringSubmit(data.stackBbString)
                )}
              >
                <TextInput
                  suffix="BB"
                  inputProps={{
                    type: "number",
                    step: 0.001,
                    className: "text-lg sm:text-xl",
                    ...register("stackBbString"),
                  }}
                />
              </form>

              <div className="mt-1 text-slate-500 dark:text-zinc-500 text-sm">
                Press enter to update.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

interface ConnectedPlayerTableRowProps
  extends Omit<PlayerTableRowProps, "user"> {}

const ConnectedPlayerTableRow: React.VFC<ConnectedPlayerTableRowProps> = ({
  gameSession,
  player,
  onRemoveClick,
  ...props
}) => {
  const { myself } = useAuth();
  const {
    user,
    isLoading: isUserLoading,
    error,
  } = useUserById({ id: player.userId });
  const canRemove =
    gameSession.creatorId === myself.id && myself.id !== player.userId;

  React.useEffect(() => {
    if (error) {
      errorToast({
        title: "Invalid Player Found",
        description: `There is an invalid user added to the game session. Please check the list of players and remove them.`,
      });
    }
  }, [error]);

  if (isUserLoading) {
    return <PlayerTableLoadingRow {...props} />;
  }

  if (!user) {
    return null;
  }

  return (
    <PlayerTableRow
      gameSession={gameSession}
      player={player}
      user={user}
      onRemoveClick={canRemove ? onRemoveClick : undefined}
      {...props}
    />
  );
};

export default GameSessionDetailPage;
