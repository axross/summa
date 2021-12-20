import * as React from "react";
import { twMerge } from "tailwind-merge";
import { User, UserUsername } from "~/models/user";
import { IconGhostButton } from "~/components/button";
import { CrossIcon, PlusIcon } from "~/components/icon";
import { TextInput } from "~/components/text-input";

export interface SimplePlayerListProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const SimplePlayerList: React.VFC<SimplePlayerListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ul
      className={twMerge(
        "-mx-4 sm:-mx-6 -my-6 bg-white dark:bg-zinc-900",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
};

export interface SimplePlayerListRowProps {
  user: User;
  onRemoveClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

export const SimplePlayerListRow: React.VFC<SimplePlayerListRowProps> = ({
  user,
  onRemoveClick,
  className,
  ...props
}) => {
  return (
    <li
      className={twMerge(
        "flex items-center space-x-4 w-full pl-4 sm:pl-6 pr-2 sm:pr-4 py-4",
        className
      )}
      {...props}
    >
      <img src={user.avatarUrl} className="w-12 h-12 rounded-full" />

      <div className="flex-grow">
        <div className="text-slate-700 dark:text-zinc-300 text-sm font-semibold">
          {user.name}
        </div>

        <div className="mt-1 text-sm text-slate-500">@{user.username}</div>
      </div>

      <IconGhostButton variant="danger" grayInitially onClick={onRemoveClick}>
        <CrossIcon />
      </IconGhostButton>
    </li>
  );
};

export interface LoadingSimplePlayerListRowProps {
  onRemoveClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingSimplePlayerListRow: React.VFC<
  LoadingSimplePlayerListRowProps
> = ({ onRemoveClick, className, ...props }) => {
  return (
    <li
      className={twMerge(
        "flex items-center space-x-4 w-full pl-4 sm:pl-6 pr-2 sm:pr-4 py-4",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 bg-slate-300 dark:bg-zinc-700 rounded-full animate-pulse" />

      <div className="flex-grow animate-pulse">
        <div className="w-1/3 h-4 bg-slate-300 dark:bg-zinc-700 rounded" />

        <div className="w-1/2 h-3 mt-3 bg-slate-300 dark:bg-zinc-700 rounded" />
      </div>

      <IconGhostButton variant="danger" grayInitially onClick={onRemoveClick}>
        <CrossIcon />
      </IconGhostButton>
    </li>
  );
};

export interface SimplePlayerListEmptyRowProps {
  className?: string;
  style?: React.CSSProperties;
}

export const SimplePlayerListEmptyRow: React.VFC<
  SimplePlayerListEmptyRowProps
> = ({ className, ...props }) => {
  return (
    <li
      className={twMerge(
        "flex flex-col items-center w-full px-4 sm:pl-6 py-6 text-slate-500",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={0.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      <div className="mt-2 text-slate-700 dark:text-zinc-300 font-medium">
        No player added
      </div>

      <div className="mt-1 text-sm">
        You can add players even after creating the game session. But we
        recommend you add all the players in advance.
      </div>
    </li>
  );
};

export interface SimplePlayerListInputRowProps {
  defaultUsername?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, username: string) => void;
  onPressEnter?: (e: React.SyntheticEvent, username: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SimplePlayerListInputRow: React.VFC<
  SimplePlayerListInputRowProps
> = ({
  defaultUsername,
  onChange = () => {},
  onPressEnter = () => {},
  className,
  ...props
}) => {
  const [username, setUsername] = React.useState(defaultUsername ?? "");

  return (
    <li
      className={twMerge(
        "flex items-center space-x-4 w-full pl-4 sm:pl-6 pr-2 sm:pr-4 py-4",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 w-12 h-12 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-full" />

      <div className="flex-grow">
        <TextInput
          prefix="@"
          inputProps={{
            type: "text",
            value: username,
            onChange: (e) => {
              setUsername(e.currentTarget.value);

              onChange(e, e.currentTarget.value);
            },
            onKeyDown: (e) => {
              if (!e.nativeEvent.isComposing && e.key === "Enter") {
                e.preventDefault();

                onPressEnter(e, e.currentTarget.value);

                setUsername("");
              }
            },
          }}
        />
      </div>

      <IconGhostButton
        disabled={!UserUsername.safeParse(username).success}
        onClick={(e) => {
          onPressEnter(e, username);

          setUsername("");
        }}
      >
        <PlusIcon />
      </IconGhostButton>
    </li>
  );
};
