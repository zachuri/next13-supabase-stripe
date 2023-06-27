import * as React from "react"

import { cn } from "@/lib/utils"

interface ControlPanelShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ControlPanelShell({
  children,
  className,
  ...props
}: ControlPanelShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  )
}
