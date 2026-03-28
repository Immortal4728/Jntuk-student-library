import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-[0.875rem] font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_2px_8px_rgba(37,99,235,0.2)]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-[#e5e7eb] bg-white text-[#475569] hover:bg-[#f8fafc] hover:border-[#cbd5e1] hover:text-[#0f172a]",
        secondary: "bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e2e8f0]",
        ghost: "hover:bg-[#f1f5f9] hover:text-[#0f172a] text-[#475569]",
        link: "text-[#2563eb] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
