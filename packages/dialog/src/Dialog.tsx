import { Button } from "@design-system/button";
import { Icon } from "@design-system/icon";
import { Typography } from "@design-system/typography";
import { forwardRef, type HTMLAttributes } from "react";

export type DialogVariant =
  | "default"
  | "confirmation"
  | "form"
  | "alert"
  | "success"
  | "fullWidth";

type DialogStatusTone = "warning" | "error" | "success";

type DialogBaseProps = HTMLAttributes<HTMLDivElement> & {
  variant: DialogVariant;
  open: boolean;
  title: string;
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onBackdropClick?: () => void;
  onCloseButtonClick?: () => void;
};

type DialogWithBody = DialogBaseProps & {
  variant: "default" | "fullWidth";
  body: string;
  secondaryActionLabel: string;
};

type DialogWithStatus = DialogBaseProps & {
  variant: "alert" | "success";
  statusText: string;
  statusTone: DialogStatusTone;
};

type DialogWithStatusAndSecondary = DialogBaseProps & {
  variant: "confirmation";
  statusText: string;
  statusTone: DialogStatusTone;
  secondaryActionLabel: string;
};

type DialogForm = DialogBaseProps & {
  variant: "form";
  body: string;
  fieldLabel: string;
  fieldPlaceholder: string;
  secondaryActionLabel: string;
};

export type DialogProps =
  | DialogWithBody
  | DialogWithStatus
  | DialogWithStatusAndSecondary
  | DialogForm;

function mergeClassNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").trim();
}

const toneClasses = {
  warning: "bg-warning",
  error: "bg-destructive",
  success: "bg-success",
} as const;

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  props,
  ref,
) {
  const {
    className,
    variant,
    open,
    title,
    primaryActionLabel,
    secondaryActionLabel,
    onPrimaryAction,
    onSecondaryAction,
    onBackdropClick,
    onCloseButtonClick,
    body,
    statusText,
    statusTone,
    fieldLabel,
    fieldPlaceholder,
    ...htmlProps
  } = props as DialogProps & {
    secondaryActionLabel?: string;
    body?: string;
    statusText?: string;
    statusTone?: DialogStatusTone;
    fieldLabel?: string;
    fieldPlaceholder?: string;
  };

  const hasBody = variant === "default" || variant === "form" || variant === "fullWidth";
  const hasIndicator = variant === "confirmation" || variant === "alert" || variant === "success";
  const isForm = variant === "form";
  const hasTwoActions = variant === "default" || variant === "confirmation" || variant === "form" || variant === "fullWidth";
  const widthClass = variant === "fullWidth" ? "w-[812px]" : "w-[480px]";

  if (!open) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-[rgb(0_0_0_/_0.5)] p-4"
      onClick={onBackdropClick}
    >
      <div
        ref={ref}
        className={mergeClassNames(
          "overflow-hidden rounded-xl border border-solid border-border-color bg-input-background text-text-on-background",
          widthClass,
          className,
        )}
        onClick={(event) => event.stopPropagation()}
        {...htmlProps}
      >
        <div className="flex items-center justify-between border-b border-solid border-border-color px-5 py-4">
          <Typography as="h3" category="Heading" size="XS" className="font-semibold">
            {title}
          </Typography>
          <button
            type="button"
            aria-label="Close dialog"
            className="inline-flex size-8 items-center justify-center rounded-md text-text-on-muted transition-colors hover:bg-bg-accent hover:text-text-on-accent"
            onClick={onCloseButtonClick}
          >
            <Icon name="x" size="sm" variant="clear" />
          </button>
        </div>

        <div
          className={mergeClassNames("flex flex-col px-5 py-4", isForm ? "gap-3" : undefined)}
        >
          {hasBody ? (
            <Typography
              as="p"
              category="Body"
              size="XS"
              className="text-[13px] leading-4 text-text-on-muted"
            >
              {body}
            </Typography>
          ) : null}

          {hasIndicator ? (
            <div className="flex items-center gap-2.5">
              <span
                className={mergeClassNames(
                  "size-5 rounded-full",
                  toneClasses[statusTone as keyof typeof toneClasses],
                )}
                aria-hidden
              />
              <Typography
                as="p"
                category="Body"
                size="XS"
                className="flex-1 text-[13px] leading-4 text-text-on-muted"
              >
                {statusText}
              </Typography>
            </div>
          ) : null}

          {isForm ? (
            <div className="flex flex-col gap-2">
              <Typography as="p" category="Label" size="XS" className="text-text-on-background">
                {fieldLabel}
              </Typography>
              <div className="rounded-md border border-solid border-border-color bg-bg-background px-3 py-2">
                <Typography as="p" category="Body" size="XS" className="text-text-on-muted">
                  {fieldPlaceholder}
                </Typography>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-solid border-border-color px-5 py-3.5">
          {hasTwoActions ? (
            <div className="text-xs leading-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            </div>
          ) : null}
          <div className="text-xs leading-4">
            <Button type="button" variant="primary" size="sm" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

Dialog.displayName = "Dialog";
