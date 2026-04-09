import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
} from "react";
import type { IconProps } from "@design-system/icon";
import { Typography } from "@design-system/typography";

export type InputLeading = ReactElement<IconProps>;
export type InputState = "default" | "disabled" | "readOnly";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  leadingIcon?: InputLeading;
  state?: InputState;
};

export type InputContainerProps = HTMLAttributes<HTMLDivElement> & {
  hasLeadingIcon?: boolean;
  state?: InputState;
};

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

export const InputContainer = forwardRef<HTMLDivElement, InputContainerProps>(
  function InputContainer(
    { hasLeadingIcon = false, state = "default", className, children, ...rest },
    ref,
  ) {
    const isDisabled = state === "disabled";

    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "flex h-9 w-80 items-center overflow-hidden rounded-md border border-solid border-border-input bg-input-background px-3 py-1",
          hasLeadingIcon ? "gap-2" : undefined,
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

function normalizedLeadingIcon(icon: InputLeading): ReactElement {
  if (!isValidElement(icon)) {
    return icon;
  }

  return cloneElement(icon, {
    size: "sm",
    variant: "clear",
    className: "text-zinc-400",
    "aria-hidden": true,
  });
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label = "Amount",
    leadingIcon,
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
      <InputContainer
        hasLeadingIcon={Boolean(leadingIcon)}
        state={isDisabled ? "disabled" : state}
      >
        {leadingIcon ? normalizedLeadingIcon(leadingIcon) : null}

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
