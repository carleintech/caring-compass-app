"use client"

import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface CTASectionProps extends HTMLAttributes<HTMLElement> {
  title: string
  description: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  className?: string
}

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-primary/5 py-16 md:py-24",
        className
      )}
      {...props}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            {title}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 md:text-xl">
            {description}
          </p>
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            {primaryAction && (
              <Button size="lg" asChild>
                <a href={primaryAction.href}>{primaryAction.label}</a>
              </Button>
            )}
            {secondaryAction && (
              <Button size="lg" variant="outline" asChild>
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>
    </section>
  )
}
