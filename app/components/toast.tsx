import { twMerge } from "tailwind-merge";
import * as React from "react";
import hotToast from "react-hot-toast";
import { ExclamationCircleIcon } from "./icon";

export interface ErrorToastProps {
  title: string;
  description?: string;
  onClick: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

export const ErrorToast: React.VFC<ErrorToastProps> = ({
  title,
  description,
  onClick,
  className,
  ...props
}) => {
  return (
    <button
      tabIndex={0}
      onClick={onClick}
      className={twMerge(
        "flex items-start space-x-3 max-w-md w-full p-4 bg-white dark:bg-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 shadow-lg pointer-events-auto",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 pt-0.5">
        <ExclamationCircleIcon className="text-red-500" />
      </div>

      <div className="flex flex-col items-start justify-items-center flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
          {title}
        </p>

        {description ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
    </button>
  );
};

export function errorToast(
  props: Pick<ErrorToastProps, "title" | "description">
): void {
  hotToast.custom((t) => (
    <ErrorToast
      {...props}
      onClick={() => hotToast.dismiss(t.id)}
      className={t.visible ? "animate-enter" : "animate-leave"}
    />
  ));
}
