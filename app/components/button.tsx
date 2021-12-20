import { twMerge } from "tailwind-merge";
import * as React from "react";
import { LoadingIcon } from "./icon";

type ButtonVariant = "primary" | "successful" | "danger";

const DEFAULT_VARIANT = "primary";

export interface RawButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const RawButton: React.VFC<RawButtonProps> = ({
  variant = DEFAULT_VARIANT,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        "inline-flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 text-white disabled:opacity-50 disabled:cursor-default transition-all",
        variant === "primary"
          ? "bg-blue-600 hover:bg-blue-500 disabled:hover:bg-blue-600 active:bg-blue-500 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900"
          : null,
        variant === "successful"
          ? "bg-emerald-600 hover:bg-emerald-500 disabled:hover:bg-emerald-600 active:bg-emerald-500 focus:ring-emerald-500 focus:ring-offset-emerald-100 dark:focus:ring-offset-emerald-900"
          : null,
        variant === "danger"
          ? "bg-rose-600 hover:bg-rose-500 disabled:hover:bg-rose-600 active:bg-rose-500 focus:ring-rose-500 focus:ring-offset-rose-100 dark:focus:ring-offset-rose-900"
          : null,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Button: React.VFC<RawButtonProps> = ({
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  return (
    <RawButton
      disabled={disabled || loading}
      className={twMerge("inline-flex px-4 py-2", className)}
      {...props}
    >
      {loading ? <LoadingIcon className="w-5 h-5 -ml-1.5 mr-3" /> : null}

      {children}
    </RawButton>
  );
};

export const IconButton: React.VFC<RawButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RawButton className={twMerge("inline-flex p-2", className)} {...props}>
      {children}
    </RawButton>
  );
};

export interface RawGhostButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  grayInitially?: boolean;
}

export const RawGhostButton: React.VFC<RawGhostButtonProps> = ({
  variant = DEFAULT_VARIANT,
  grayInitially = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        "inline-flex items-center disabled:hover:bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 disabled:cursor-default transition-all",
        grayInitially ? "text-slate-700 dark:text-zinc-300" : null,
        variant === "primary"
          ? "hover:bg-blue-100 active:bg-blue-200 dark:hover:bg-blue-900 dark:active:bg-blue-800 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 disabled:text-blue-500/50"
          : null,
        variant === "primary" && grayInitially
          ? "hover:text-blue-600 focus:text-blue-600 dark:hover:text-blue-400 dark:focus:text-blue-400"
          : null,
        variant === "primary" && !grayInitially
          ? "text-blue-600 dark:text-blue-400"
          : null,
        variant === "successful"
          ? "hover:bg-green-100 active:bg-green-200 dark:hover:bg-green-900 dark:active:bg-green-800 focus:ring-green-500 focus:ring-offset-green-100 dark:focus:ring-offset-green-900 disabled:text-green-500/50"
          : null,
        variant === "successful" && grayInitially
          ? "hover:text-emerald-600 focus:text-emerald-600 dark:hover:text-emerald-400 dark:focus:text-emerald-400"
          : null,
        variant === "successful" && !grayInitially
          ? "text-emerald-600 dark:text-emerald-400"
          : null,
        variant === "danger"
          ? "hover:bg-rose-100 active:bg-rose-200 dark:hover:bg-rose-900 dark:active:bg-rose-800 focus:ring-rose-500 focus:ring-offset-rose-100 dark:focus:ring-offset-rose-900 disabled:text-rose-500/50"
          : null,
        variant === "danger" && grayInitially
          ? "hover:text-rose-600 focus:text-rose-600 dark:hover:text-rose-400 dark:focus:text-rose-400"
          : null,
        variant === "danger" && !grayInitially
          ? "text-rose-600 dark:text-rose-400"
          : null,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const GhostButton: React.VFC<RawGhostButtonProps> = ({
  variant = DEFAULT_VARIANT,
  disabled,
  loading = false,
  className,
  children,
  ...props
}) => {
  return (
    <RawGhostButton
      variant={variant}
      disabled={disabled || loading}
      className={twMerge(
        "inline-flex px-4 py-2",
        variant === "primary" && loading
          ? "bg-blue-100 dark:bg-blue-900 active:bg-blue-100 dark:active:bg-blue-900"
          : null,
        variant === "successful" && loading
          ? "bg-green-100 dark:bg-green-900 active:bg-green-100 dark:active:bg-green-900"
          : null,
        variant === "danger" && loading
          ? "bg-rose-100 dark:bg-rose-900 active:bg-rose-100 dark:active:bg-rose-900"
          : null,
        className
      )}
      {...props}
    >
      {loading ? <LoadingIcon className="w-5 h-5 -ml-1.5 mr-3" /> : null}

      {children}
    </RawGhostButton>
  );
};

export const IconGhostButton: React.VFC<RawGhostButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RawGhostButton
      className={twMerge("inline-flex p-2", className)}
      {...props}
    >
      {children}
    </RawGhostButton>
  );
};
