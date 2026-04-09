import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { Icon } from "@design-system/icon";
import { Typography } from "@design-system/typography";

export type InputLeading = "none" | "icon";
export type InputState = "default" | "disabled" | "readOnly";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  leading?: InputLeading;
  state?: InputState;
};

export type InputContainerProps = HTMLAttributes<HTMLDivElement> & {
  leading?: InputLeading;
  state?: InputState;
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export const InputContainer = forwardRef<HTMLDivElement, InputContainerProps>(
  function InputContainer(
    { leading = "none", state = "default", className, children, ...rest },
    ref,
  ) {
    const isDisabled = state === "disabled";

    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "flex h-9 w-80 items-center overflow-hidden rounded-md border border-solid border-border-input bg-input-background px-3 py-1",
          leading === "icon" ? "gap-2" : undefined,
          isDisabled ? "opacity-50" : undefined,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

InputContainer.displayName = "InputContainer";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label = "Amount",
    leading = "none",
    state = "default",
    className,
    readOnly,
    disabled,
    value,
    defaultValue,
    placeholder = "0.00",
    id,
    ...rest
  },
  ref,
) {
  const isDisabled = state === "disabled" || Boolean(disabled);
  const isReadOnly = state === "readOnly" || Boolean(readOnly);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col items-start gap-2">
      <Typography
        as="label"
        htmlFor={inputId}
        category="Label"
        size="M"
        className="leading-[14px]"
      >
        {label}
      </Typography>
      <InputContainer leading={leading} state={isDisabled ? "disabled" : state}>
        {leading === "icon" ? (
          <Icon
            name="search"
            size="sm"
            variant="clear"
            className="text-zinc-400"
            aria-hidden
          />
        ) : null}

        <input
          id={inputId}
          ref={ref}
          className={mergeClassNames(
            "w-full min-w-0 border-0 bg-transparent p-0 text-sm leading-normal text-text-on-background outline-none placeholder:text-text-input-placeholder",
            isDisabled ? "text-text-input-placeholder" : undefined,
            className,
          )}
          disabled={isDisabled}
          readOnly={isReadOnly}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...rest}
        />
      </InputContainer>
    </div>
  );
});

Input.displayName = "Input";
