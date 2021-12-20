import * as React from "react";
import { twMerge } from "tailwind-merge";
import { useFormFieldContext } from "./form-field";

export interface TextInputProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  inputProps?: React.RefAttributes<HTMLInputElement> &
    React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
}

export const TextInput: React.VFC<TextInputProps> = ({
  prefix,
  suffix,
  inputProps = {},
  className,
  ...props
}) => {
  const formFieldContext = useFormFieldContext();
  const { className: inputClassName, ...restInputProps } = inputProps;

  return (
    <div className={twMerge("flex rounded-md shadow-sm", className)} {...props}>
      {prefix ? (
        <span className="inline-flex items-center px-3 bg-slate-50 dark:bg-zinc-900 border border-r-0 border-slate-300 dark:border-zinc-700 rounded-l-md text-slate-500 dark:text-zinc-500 text-sm">
          {prefix}
        </span>
      ) : null}

      <input
        type="text"
        className={twMerge(
          "flex-1 block w-full bg-white dark:bg-black border-slate-300 dark:border-zinc-700 focus:border-slate-300 dark:focus:border-zinc-700 aria-invalid:border-rose-500 aria-invalid:focus:border-rose-300 dark:aria-invalid:focus:border-rose-700 rounded-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-blue-900 aria-invalid:focus:ring-rose-500 aria-invalid:focus:ring-offset-rose-100 dark:aria-invalid:focus:ring-offset-rose-900 dark:text-zinc-300 sm:text-sm caret-blue-500 aria-invalid:caret-rose-500 transition-all",
          !prefix ? "rounded-l-md" : null,
          !suffix ? "rounded-r-md" : null,
          suffix ? "z-10" : null,
          formFieldContext.className,
          inputClassName
        )}
        id={formFieldContext.id}
        aria-invalid={formFieldContext["aria-invalid"]}
        {...restInputProps}
      />

      {suffix ? (
        <span className="inline-flex items-center px-3 bg-slate-50 dark:bg-zinc-900 border border-l-0 border-slate-300 dark:border-zinc-700 rounded-r-md text-slate-500 dark:text-zinc-500 text-sm">
          {suffix}
        </span>
      ) : null}
    </div>
  );
};
