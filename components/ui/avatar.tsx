"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /** Image source URL */
  src?: string | null
  /** Alt text for the image */
  alt?: string
  /** User name used to generate fallback initial */
  name?: string | null
}

function Avatar({ className, src, alt, name, ...props }: AvatarProps) {
  const fallbackInitial = name?.charAt(0).toUpperCase() ?? "?"

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "bg-primary relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        src={src ?? undefined}
        alt={alt ?? name ?? "Avatar"}
        className="aspect-square size-full"
      />
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className="text-md font-semibold text-primary-foreground flex size-full items-center justify-center rounded-full"
      >
        {fallbackInitial}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

export { Avatar }
export type { AvatarProps }

