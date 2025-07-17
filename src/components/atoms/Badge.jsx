import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-gradient-to-r from-primary/10 to-secondary/20 text-primary",
      secondary: "bg-gradient-to-r from-secondary/10 to-primary/20 text-secondary",
      success: "bg-gradient-to-r from-success/10 to-green-100 text-success",
      warning: "bg-gradient-to-r from-warning/10 to-yellow-100 text-yellow-700",
      error: "bg-gradient-to-r from-error/10 to-red-100 text-error",
      info: "bg-gradient-to-r from-info/10 to-blue-100 text-info",
      high: "bg-gradient-to-r from-error/10 to-red-100 text-error",
      medium: "bg-gradient-to-r from-warning/10 to-yellow-100 text-yellow-700",
      low: "bg-gradient-to-r from-success/10 to-green-100 text-success",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      default: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;