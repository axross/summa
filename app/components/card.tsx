import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Card: React.VFC<CardProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        "block px-4 py-5 sm:p-6 bg-white dark:bg-zinc-900 shadow dark:shadow-none sm:rounded-md sm:overflow-hidden",
        className
      )}
      {...props}
    />
  );
};

export const CardFooter: React.VFC<CardProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        "mt-6 -mx-4 -mb-5 sm:-mx-6 sm:-mb-6 px-4 py-4 sm:px-6 bg-slate-50 dark:bg-zinc-800 text-right",
        className
      )}
      {...props}
    />
  );
};
