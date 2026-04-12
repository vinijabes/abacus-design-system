import { forwardRef } from "react";
import { Button, type ButtonProps } from "./Button";

export type FloatingActionButtonProps = Omit<
  ButtonProps,
  "variant" | "size"
>;

export const FloatingActionButton = forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(function FloatingActionButton(props, ref) {
  return <Button ref={ref} variant="fab" {...props} />;
});

FloatingActionButton.displayName = "FloatingActionButton";
