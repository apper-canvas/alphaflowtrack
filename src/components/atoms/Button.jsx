import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-white/10 backdrop-blur-lg border border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white/20 hover:scale-105 focus:ring-primary-500",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:scale-105 focus:ring-primary-500",
    ghost: "text-slate-700 dark:text-slate-200 hover:bg-white/10 hover:backdrop-blur-lg focus:ring-primary-500",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:scale-105"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    default: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;