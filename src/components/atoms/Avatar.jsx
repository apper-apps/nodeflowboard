import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(
  ({ className, src, alt, name, size = "default", ...props }, ref) => {
    const sizes = {
      sm: "h-6 w-6 text-xs",
      default: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
      xl: "h-12 w-12 text-lg",
    };

    const getInitials = (name) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium",
      sizes[size],
      className
    );

    if (src) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt || name}
          className={cn(baseClasses, "object-cover")}
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {getInitials(name)}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;