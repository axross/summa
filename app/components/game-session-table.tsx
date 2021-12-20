import { formatDistanceToNow } from "date-fns";
import * as React from "react";
import { Link } from "remix";
import { twMerge } from "tailwind-merge";
import { useGameSessionPlayers } from "~/hooks/use-game-session-players";
import { useUserById } from "~/hooks/use-user";
import { GameSession } from "~/models/game-session";
import { UserId } from "~/models/user";

export interface GameSessionTableProps {
  className?: string;
  style?: React.CSSProperties;
  children?:
    | React.ReactComponentElement<
        typeof GameSessionTableRow,
        GameSessionTableRowProps
      >[]
    | React.ReactComponentElement<
        typeof GameSessionTableRow,
        GameSessionTableRowProps
      >;
}

export const GameSessionTable: React.VFC<GameSessionTableProps> = ({
  className,
  children = [],
  ...props
}) => {
  return (
    <ul
      className={twMerge(
        "block col-start-1 row-start-2 col-end-3 w-full bg-white border rounded-md border-gray-300 shadow",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, i) =>
        i !== 0
          ? React.cloneElement(child, {
              ...child.props,
              className: "border-t border-gray-300",
            })
          : child
      )}
    </ul>
  );
};

export interface GameSessionTableRowProps {
  gameSession: GameSession;
  className?: string;
  style?: React.CSSProperties;
}

export const GameSessionTableRow: React.VFC<GameSessionTableRowProps> = ({
  gameSession,
  className,
  ...props
}) => {
  const { players } = useGameSessionPlayers({ id: gameSession.id });

  return (
    <li className={twMerge("block", className)} {...props}>
      <Link
        to={`/game-sessions/${gameSession.id}`}
        className="grid w-full p-4 gap-y-2"
      >
        <div className="flex items-center">
          <span className="font-semibold text-blue-700">
            {gameSession.name}
          </span>

          {gameSession.endedAt ? (
            <span className="inline-block ml-2 text-gray-500 text-xs">
              {formatDistanceToNow(gameSession.endedAt, {
                addSuffix: true,
              })}
            </span>
          ) : (
            <span className="inline-block ml-2 px-2 py-0.5 bg-green-200 rounded-full text-green-700 text-xs">
              Ongoing
            </span>
          )}
        </div>

        <div className="row-start-2 text-gray-700">
          ${gameSession.rate * gameSession.buyinBb} per {gameSession.buyinBb}BB
        </div>

        <div className="col-start-2 row-start-1 row-end-3 flex items-center justify-end">
          {players.map((player) => {
            return (
              <GameSessionTablePlayerAvatar
                userId={player.userId}
                key={player.userId}
              />
            );
          })}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </li>
  );
};

export interface GameSessionTablePlayerAvatarProps {
  userId: UserId;
  className?: string;
  style?: React.CSSProperties;
}

export const GameSessionTablePlayerAvatar: React.VFC<
  GameSessionTablePlayerAvatarProps
> = ({ userId, className, ...props }) => {
  const { user } = useUserById({ id: userId });

  return (
    <img
      src={user?.avatarUrl}
      alt={user?.name}
      className="inline-flex items-center justify-center -ml-1 w-5 h-5 rounded-full ring-2 ring-white"
      {...props}
    />
  );
};

export interface EmptyGameSessionTableProps {
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyGameSessionTable: React.VFC<EmptyGameSessionTableProps> = ({
  className,
  ...props
}) => {
  return (
    // <div className="px-4 py-6 sm:px-0">
    //   <div className=" h-96"></div>
    // </div>

    <div
      className={twMerge(
        "col-start-1 row-start-2 col-end-3 flex flex-col items-center w-full mt-4 px-4 py-10 border-2 border-dashed border-gray-200 rounded-lg",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>

      <div className="mt-2 font-medium">No past game session</div>

      <div className="mt-1 text-gray-500 text-sm">
        Get started by opening a new game session.
      </div>

      <Link to="/game-sessions/new">
        <button className="flex justify-self-end mt-6 px-4 py-1.5 items-center justify-center rounded-md bg-blue-700 text-white">
          New Game Session
        </button>
      </Link>
    </div>
  );
};
