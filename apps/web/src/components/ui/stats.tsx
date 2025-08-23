"use client"

import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"

interface Stat {
  value: string
  label: string
  description?: string
}

interface StatsProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  stats: Stat[]
  className?: string
}

export function Stats({
  title,
  description,
  stats,
  className,
  ...props
}: StatsProps) {
  return (
    <section
      className={cn("py-12 md:py-24", className)}
      {...props}
    >
      <div className="container px-4 md:px-6">
        {(title || description) && (
          <div className="mx-auto mb-12 max-w-[58rem] text-center">
            {title && (
              <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {stats.map((stat, i) => (
            <Card key={`${stat.label}-${i}`} className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <p className="text-4xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  {stat.description && (
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
