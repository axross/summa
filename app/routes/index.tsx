import { Link, MetaFunction, RouteComponent } from "remix";
import {
  GameSessionCard,
  GameSessionCardPlayerAvatar,
  GameSessionCardPlayerAvatarProps,
  GameSessionCardProps,
  GameSessionEmptyCard,
  LoadingGameSessionCard,
  LoadingGameSessionCardPlayerAvatar,
} from "~/components/game-session-card";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutHeaderTitle,
} from "~/components/layout";
import { useAuth } from "~/hooks/use-auth";
import { useGameSessionPlayers } from "~/hooks/use-game-session-players";
import { useOngoingGameSessions } from "~/hooks/use-ongoing-game-sessions";
import { useUserById } from "~/hooks/use-user";
import { UserId } from "~/models/user";

export const meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

const GameSessionListPage: RouteComponent = () => {
  const { myself, deauthenticate } = useAuth();
  const {
    gameSessions: ongoingGameSessions,
    isLoading: areOngoingGameSessionsLoading,
  } = useOngoingGameSessions();

  return (
    <Layout myself={myself} onSignOutClick={deauthenticate}>
      <LayoutHeader>
        <LayoutHeaderTitle>Dashboard</LayoutHeaderTitle>
      </LayoutHeader>

      <LayoutContent>
        <section className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-4 w-full">
          {areOngoingGameSessionsLoading ? (
            <>
              <LoadingGameSessionCard />

              <LoadingGameSessionCard />
            </>
          ) : (
            ongoingGameSessions.map((gameSession) => (
              <Link
                to={`/game-sessions/${gameSession.id}`}
                className="focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 rounded"
                key={gameSession.id}
              >
                <ConnectedGameSessionCard
                  gameSession={gameSession}
                  className="h-full"
                />
              </Link>
            ))
          )}

          <Link
            to="/game-sessions/new"
            className="focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 rounded"
          >
            <GameSessionEmptyCard className="h-full" />
          </Link>
        </section>
      </LayoutContent>
    </Layout>
  );
};

type ConnectedGameSessionCardProps = Omit<
  GameSessionCardProps,
  "myStackBb" | "myBuyins" | "avatars"
>;

const ConnectedGameSessionCard: React.VFC<ConnectedGameSessionCardProps> = ({
  gameSession,
  ...props
}) => {
  const { myself } = useAuth();
  const { players, isLoading, error } = useGameSessionPlayers({
    id: gameSession.id,
  });
  const myPlayer = players.find((p) => p.userId === myself.id);

  if (isLoading) {
    return <LoadingGameSessionCard />;
  }

  if (!myPlayer) {
    // someToast();

    return null;
  }

  return (
    <GameSessionCard
      gameSession={gameSession}
      myStackBb={myPlayer.stackBb}
      myBuyins={myPlayer.buyins}
      avatars={players.map((player) => (
        <ConnectedGameSessionCardPlayerAvatar
          userId={player.userId}
          className="ml-1 first-of-type:ml-0"
          key={player.userId}
        />
      ))}
      {...props}
    />
  );
};

interface ConnectedGameSessionCardPlayerAvatarProps
  extends Omit<
    GameSessionCardPlayerAvatarProps,
    "playerName" | "playerAvatarUrl"
  > {
  userId: UserId;
}

const ConnectedGameSessionCardPlayerAvatar: React.VFC<
  ConnectedGameSessionCardPlayerAvatarProps
> = ({ userId, ...props }) => {
  const { user, isLoading } = useUserById({ id: userId });

  if (isLoading) {
    return <LoadingGameSessionCardPlayerAvatar {...props} />;
  }

  if (!user) {
    return null;
  }

  return (
    <GameSessionCardPlayerAvatar
      playerName={user.name}
      playerAvatarUrl={user.avatarUrl}
      {...props}
    />
  );
};

export default GameSessionListPage;
