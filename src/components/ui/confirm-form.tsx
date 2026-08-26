"use client";

import type { FormHTMLAttributes } from "react";

export function ConfirmForm({
  confirmMessage,
  onSubmit,
  ...props
}: { confirmMessage: string } & FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onSubmit?.(e);
      }}
    />
  );
}
