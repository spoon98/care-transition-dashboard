import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cascala-green/10 text-cascala-green [a&]:hover:bg-cascala-green/20",
        secondary:
          "border-transparent bg-cascala-orange/10 text-cascala-orange [a&]:hover:bg-cascala-orange/20",
        destructive:
          "border-transparent bg-cascala-red/10 text-cascala-red [a&]:hover:bg-cascala-red/20",
        outline:
          "border-cascala-gray-200 text-cascala-gray-700 [a&]:hover:bg-cascala-gray-50 [a&]:hover:border-cascala-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
