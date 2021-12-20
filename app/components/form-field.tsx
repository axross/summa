import { nanoid } from "nanoid";
import * as React from "react";
import { Control, useFormState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

const FormFieldContext = React.createContext<{
  id?: string;
  className?: string;
  "aria-invalid"?: "true";
} | null>(null);

export function useFormFieldContext(): {
  id?: string;
  className?: string;
  "aria-invalid"?: "true";
} {
  const context = React.useContext(FormFieldContext);

  return context ?? {};
}

export interface FormFieldProps {
  label: string;
  helperText?: string;
  errorText?: string;
  name?: string | string[];
  control?: Control<any, any>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function FormField({ name, control, ...props }: FormFieldProps) {
  if (name !== undefined && control !== undefined) {
    return <ControlledFormField name={name} control={control} {...props} />;
  }

  return <UncontrolledFormField {...props} />;
}

interface UncontrolledFormFieldProps
  extends Omit<FormFieldProps, "name" | "control"> {}

const UncontrolledFormField: React.VFC<UncontrolledFormFieldProps> = ({
  label,
  helperText,
  errorText,
  children,
  ...props
}) => {
  const generatedId = React.useMemo(() => nanoid(), []);

  return (
    <div {...props}>
      <label
        htmlFor={generatedId}
        className={twMerge(
          "block text-sm font-medium",
          errorText === undefined
            ? "text-slate-500 dark:text-zinc-500"
            : "text-red-500"
        )}
      >
        {label}
      </label>

      <div className="flex items-center space-x-2 mt-1">
        <FormFieldContext.Provider
          value={{
            ...(React.Children.count(children) === 1
              ? { id: generatedId, className: "w-full" }
              : {}),
            "aria-invalid": errorText !== undefined ? "true" : undefined,
          }}
        >
          {children}
        </FormFieldContext.Provider>
      </div>

      {errorText ? (
        <p className="mt-2 -mb-1.5 text-sm text-red-500">{errorText}</p>
      ) : null}

      {helperText ? (
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

interface ControlledFormFieldProps
  extends Omit<FormFieldProps, "name" | "control"> {
  name: string | string[];
  control: Control;
}

function ControlledFormField({
  name,
  control,
  ...props
}: ControlledFormFieldProps) {
  const { errors } = useFormState({ control, name });
  const errorText = Array.isArray(name)
    ? name.reduce((msg, n) => msg ?? errors[n]?.message, undefined)
    : errors[name]?.message;

  return <UncontrolledFormField errorText={errorText} {...props} />;
}
