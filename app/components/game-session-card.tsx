import { formatDistanceToNow } from "date-fns";
import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "~/components/card";
import { GameSession } from "~/models/game-session";
import { GameSessionPlayer } from "~/models/game-session-player";

export interface GameSessionCardProps {
  gameSession: GameSession;
  myStackBb: GameSessionPlayer["stackBb"];
  myBuyins: GameSessionPlayer["buyins"];
  avatars: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GameSessionCard: React.VFC<GameSessionCardProps> = ({
  gameSession,
  avatars,
  myStackBb,
  myBuyins,
  ...props
}) => {
  return (
    <Card {...props}>
      <h2 className="font-medium text-blue-600 dark:text-blue-400">
        {gameSession.name}
      </h2>

      <div className="flex space-x-1 pt-2">{avatars}</div>

      <div className="pt-4 text-sm text-slate-500 dark:text-zinc-500">
        You have {myStackBb} BB • {myBuyins} times bought
      </div>

      <div className="pt-2 text-xs text-slate-500 dark:text-zinc-500">
        Started {formatDistanceToNow(gameSession.startedAt)}
      </div>
    </Card>
  );
};

export interface GameSessionCardPlayerAvatarProps {
  playerName: string;
  playerAvatarUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GameSessionCardPlayerAvatar: React.VFC<
  GameSessionCardPlayerAvatarProps
> = ({ playerName, playerAvatarUrl, className, ...props }) => {
  return (
    <img
      src={playerAvatarUrl}
      alt={playerName}
      className={twMerge(
        "inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white dark:ring-zinc-900",
        className
      )}
      {...props}
    />
  );
};

export const LoadingGameSessionCard: React.VFC<LoadingGameSessionCardProps> = (
  props
) => {
  return (
    <Card {...props}>
      <div className="w-2/3 h-4 mt-1 bg-slate-300 dark:bg-zinc-700 rounded animate-pulse" />

      <div className="flex space-x-1 mt-3.5">
        <LoadingGameSessionCardPlayerAvatar />

        <LoadingGameSessionCardPlayerAvatar />

        <LoadingGameSessionCardPlayerAvatar />

        <LoadingGameSessionCardPlayerAvatar />

        <LoadingGameSessionCardPlayerAvatar />

        <LoadingGameSessionCardPlayerAvatar />
      </div>

      <div className="w-2/3 h-4 mt-4 bg-slate-300 dark:bg-zinc-700 rounded animate-pulse" />

      <div className="w-2/3 h-3 mt-3.5 bg-slate-300 dark:bg-zinc-700 rounded animate-pulse" />
    </Card>
  );
};

export interface LoadingGameSessionCardPlayerAvatarProps {
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingGameSessionCardPlayerAvatar: React.VFC<
  LoadingGameSessionCardPlayerAvatarProps
> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        "inline-block w-6 h-6 bg-slate-300 dark:bg-zinc-700 rounded-full ring-2 ring-white dark:ring-zinc-900 animate-pulse",
        className
      )}
      {...props}
    />
  );
};

export interface GameSessionEmptyCardProps {
  className?: string;
  style?: React.CSSProperties;
}

export const GameSessionEmptyCard: React.VFC<GameSessionEmptyCardProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center px-4 py-7 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-lg sm:rounded-md",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-slate-300 dark:text-zinc-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v16m8-8H4"
        />
      </svg>

      <div className="mt-2 text-slate-700 dark:text-zinc-300 font-medium">
        New Game Session
      </div>

      <div className="mt-1 text-slate-500 dark:text-zinc-500 text-sm">
        Start a new poker party!
      </div>
    </div>
  );
};

export interface LoadingGameSessionCardProps {
  className?: string;
  style?: React.CSSProperties;
}
