"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps): React.ReactElement {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}


