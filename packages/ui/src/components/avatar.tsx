"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { User } from "lucide-react";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const showFallback = !src || hasError;

  // Get initials from fallback text
  const initials = React.useMemo(() => {
    if (!fallback) return null;
    const words = fallback.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return fallback.slice(0, 2).toUpperCase();
  }, [fallback]);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-600">
          {initials ? (
            <span className={cn(
              "font-medium",
              size === "xs" && "text-[10px]",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base",
              size === "xl" && "text-lg",
              size === "2xl" && "text-xl"
            )}>
              {initials}
            </span>
          ) : (
            <User className={cn(
              size === "xs" && "h-3 w-3",
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-6 w-6",
              size === "xl" && "h-8 w-8",
              size === "2xl" && "h-10 w-10"
            )} />
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export { Avatar, avatarVariants };
