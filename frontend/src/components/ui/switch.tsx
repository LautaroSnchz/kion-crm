import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // track
        "peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-colors",
        "ring-1 ring-[color:var(--ring)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        // colores del track
        "data-[state=checked]:bg-[color-mix(in_oklab,var(--primary)_60%,black)]",
        "data-[state=unchecked]:bg-border dark:data-[state=unchecked]:bg-input/80",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // thumb
          "pointer-events-none block h-5 w-5 rounded-full bg-card shadow transition-transform duration-200",
          "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4",
          // en dark garantiza contraste
          "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
