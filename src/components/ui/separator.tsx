import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { 
      className, 
      orientation = "horizontal", // default to horizontal - most common use case
      decorative = true, // decorative = true means screen readers ignore it
      ...props 
    }, 
    ref
  ) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border", // base styles - shrink-0 prevents flex weirdness
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className // custom classes can override if needed
    )}
    {...props}
  />
));

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
