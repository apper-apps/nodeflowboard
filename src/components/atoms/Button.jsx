import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    children, 
    icon, 
    iconPosition = "left",
    loading = false,
    disabled = false,
    ...props 
  }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-primary to-secondary text-white shadow-sm hover:shadow-md",
      secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
      outline: "border border-primary text-primary hover:bg-primary hover:text-white",
      ghost: "text-gray-700 hover:bg-gray-100",
      danger: "bg-gradient-to-r from-error to-red-500 text-white shadow-sm hover:shadow-md",
      success: "bg-gradient-to-r from-success to-green-500 text-white shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      default: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {loading && (
          <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
        )}
        {icon && iconPosition === "left" && !loading && (
          <ApperIcon name={icon} className="h-4 w-4 mr-2" />
        )}
        {children}
        {icon && iconPosition === "right" && !loading && (
          <ApperIcon name={icon} className="h-4 w-4 ml-2" />
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;