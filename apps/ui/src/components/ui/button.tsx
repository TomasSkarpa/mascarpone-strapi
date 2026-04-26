import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/styles"
import { Spinner } from "@/components/elementary/Spinner"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    // Don't forget to keep in sync with Link component (AppLink) and Strapi link decorations
    variants: {
      variant: {
        default:
          "w-full transform bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md " +
          "hover:scale-[1.02] hover:from-red-700 hover:to-red-800 hover:shadow-lg " +
          "active:scale-[0.98] active:from-red-800 active:to-red-900 " +
          "md:w-auto",
        destructive:
          "bg-destructive text-white " +
          "hover:bg-destructive/90 active:scale-[0.99] active:bg-destructive/85 " +
          "focus-visible:ring-destructive/40 dark:focus-visible:ring-destructive/50 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs " +
          "hover:bg-accent hover:text-accent-foreground active:scale-[0.99] active:bg-accent/80 " +
          "dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs " +
          "hover:bg-secondary/80 active:scale-[0.99] active:bg-secondary/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:scale-100 " +
          "active:bg-accent/60",
        link:
          "text-gray-900 underline-offset-4 " +
          "no-underline hover:underline " +
          "active:scale-100 active:opacity-80 " +
          "hover:text-gray-800 " +
          "focus-visible:underline focus-visible:ring-2 focus-visible:ring-primary/40 " +
          "focus-visible:ring-offset-2 dark:text-gray-900 dark:hover:text-gray-800 " +
          "dark:focus-visible:ring-primary-400/50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  if (isLoading) {
    props.children = <Spinner className="h-4 w-4 border-2" />
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
