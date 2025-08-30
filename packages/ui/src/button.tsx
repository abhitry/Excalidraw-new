"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm";
  children: ReactNode;
}

export const Button = ({
  size,
  variant,
  className = "",
  onClick,
  children,
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition";
  const sizeStyles = size === "lg" ? "px-6 py-3 text-lg" : "px-3 py-2 text-sm";
  const variantStyles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : variant === "secondary"
      ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
      : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
