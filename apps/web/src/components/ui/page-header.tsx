"use client"

import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  title: string
  description?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "bg-gradient-to-b from-primary/5 to-background py-16 md:py-24",
        className
      )}
      {...props}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-[85%] text-lg text-muted-foreground sm:text-xl">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>
    </section>
  )
}
