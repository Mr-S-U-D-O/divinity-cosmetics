import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
  withArrow?: boolean;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  withArrow = true,
  href,
  external,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClass = variant === "primary"
    ? size === "sm" ? "btn-primary-sm" : "btn-primary"
    : variant === "secondary"
    ? size === "sm" ? "btn-secondary-sm" : "btn-secondary"
    : "btn-ghost";

  const arrowClass = withArrow ? "" : "btn-no-arrow";
  const combinedClass = `${baseClass} ${arrowClass} ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClass}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className={combinedClass}
      {...props}
    >
      {children}
    </button>
  );
}

