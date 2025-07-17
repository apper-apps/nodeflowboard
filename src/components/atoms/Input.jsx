import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(
  ({ 
    className, 
    type = "text", 
    label, 
    error, 
    icon, 
    iconPosition = "left",
    ...props 
  }, ref) => {
    const baseClasses = cn(
      "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
      "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      icon && iconPosition === "left" && "pl-10",
      icon && iconPosition === "right" && "pr-10",
      error && "border-error focus:ring-error",
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={cn(
              "absolute inset-y-0 flex items-center pointer-events-none",
              iconPosition === "left" ? "left-3" : "right-3"
            )}>
              <ApperIcon name={icon} className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <input
            type={type}
            className={baseClasses}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;