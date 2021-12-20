import * as React from "react";
import { twMerge } from "tailwind-merge";
import { GameSession } from "~/models/game-session";
import { GameSessionPlayer } from "~/models/game-session-player";
import { User } from "~/models/user";
import { GhostButton } from "./button";
import { Card } from "./card";
import { DownIcon, RightIcon, UpIcon } from "./icon";
import { TextInput } from "./text-input";

export interface PlayerTableProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const PlayerTable: React.VFC<PlayerTableProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Card
      className={twMerge("flex flex-col p-0 sm:p-0 overflow-x-auto", className)}
      {...props}
    >
      <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-700">
        <thead className="bg-slate-50 dark:bg-zinc-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-slate-500 dark:text-zinc-500 text-left text-xs font-medium uppercase tracking-wider"
            >
              Player
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-slate-500 dark:text-zinc-500 text-left text-xs font-medium uppercase tracking-wider"
            >
              Status
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-slate-500 dark:text-zinc-500 text-left text-xs font-medium uppercase tracking-wider"
            >
              Total
            </th>

            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-slate-200 dark:divide-zinc-700">
          {children}
        </tbody>
      </table>
    </Card>
  );
};

export interface PlayerTableRowProps {
  gameSession: GameSession;
  player: GameSessionPlayer;
  user: User;
  onRemoveClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerTableRow: React.VFC<PlayerTableRowProps> = ({
  gameSession,
  player,
  user,
  onRemoveClick,
  ...props
}) => {
  const diffBb = player.stackBb - player.buyins * gameSession.buyinBb;

  return (
    <tr {...props}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={user?.avatarUrl}
              alt={user?.name}
            />
          </div>

          <div className="ml-4">
            <div className="text-slate-900 dark:text-zinc-100 text-sm font-medium">
              {user?.name}
            </div>
            <div className="text-sm text-slate-500 dark:text-zinc-500">
              @{user?.username}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-slate-700 dark:text-zinc-300 text-sm">
          Has {player.stackBb.toFixed(2)} BB
        </div>

        <div className="text-slate-500 dark:text-zinc-500 text-sm">
          Bought {player.buyins} times
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {diffBb === 0 ? (
            <RightIcon
              strokeWidth={2}
              className="text-blue-600 dark:text-blue-400"
            />
          ) : diffBb > 0 ? (
            <UpIcon
              strokeWidth={2}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <DownIcon
              strokeWidth={2}
              className="text-rose-600 dark:text-rose-400"
            />
          )}

          <span
            className={twMerge(
              "text-lg font-semibold",
              diffBb === 0 ? "text-blue-600 dark:text-blue-400" : null,
              diffBb > 0 ? "text-emerald-600 dark:text-emerald-400" : null,
              diffBb < 0 ? "text-rose-600 dark:text-rose-400" : null
            )}
          >
            {diffBb < 0 ? "-$" : "$"}
            {Math.abs(diffBb * gameSession.rate).toFixed(2)}
          </span>
        </div>
      </td>

      <td className="flex justify-end pl-6 pr-2 py-4">
        {onRemoveClick ? (
          <GhostButton
            variant="danger"
            grayInitially
            onClick={onRemoveClick}
            className="text-sm"
          >
            Remove
          </GhostButton>
        ) : null}
      </td>
    </tr>
  );
};

export interface PlayerTableLoadingRowProps {
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerTableLoadingRow: React.VFC<PlayerTableLoadingRowProps> = ({
  className,
  ...props
}) => {
  return (
    <tr className={twMerge("animate-pulse", className)} {...props}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 bg-slate-300 dark:bg-zinc-700 rounded-full" />
          </div>

          <div className="w-full ml-4">
            <div className="w-20 h-4 bg-slate-300 dark:bg-zinc-700 rounded" />

            <div className="w-16 h-4 mt-2 bg-slate-300 dark:bg-zinc-700 rounded" />
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-20 h-4 bg-slate-300 dark:bg-zinc-700 rounded" />

        <div className="w-24 h-4 mt-2 bg-slate-300 dark:bg-zinc-700 rounded" />
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-12 h-4 bg-slate-300 dark:bg-zinc-700 rounded" />
      </td>

      <td className="w-28"></td>
    </tr>
  );
};

export interface PlayerTableInputRowProps {
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, username: string) => void;
  onPressEnter?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    username: string
  ) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerTableInputRow: React.VFC<PlayerTableInputRowProps> = ({
  defaultValue,
  onChange = () => {},
  onPressEnter = () => {},
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <tr {...props}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="w-10 h-10 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-full" />
          </div>

          <TextInput
            prefix="@"
            inputProps={{
              type: "text",
              defaultValue,
              onChange: (e) => onChange(e, e.currentTarget.value),
              onKeyDown: (e) => {
                if (!e.nativeEvent.isComposing && e.key === "Enter") {
                  onPressEnter(e, e.currentTarget.value);

                  e.currentTarget.value = "";
                }
              },
              ref: inputRef,
            }}
            className="w-48 ml-4"
          />
        </div>
      </td>

      <td colSpan={3}></td>
    </tr>
  );
};
