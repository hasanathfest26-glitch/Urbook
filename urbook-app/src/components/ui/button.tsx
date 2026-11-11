import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44715a] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px", {
  variants: {
    variant: { default: "bg-[#17251f] text-white hover:-translate-y-0.5 hover:bg-[#284235]", outline: "border border-[#17251f] bg-transparent text-[#17251f] hover:bg-[#f1eee5]", ghost: "text-[#44715a] hover:underline underline-offset-4" },
    size: { default: "h-11 px-4", sm: "h-9 px-3 text-xs", lg: "h-12 px-5" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />);
Button.displayName = "Button";
