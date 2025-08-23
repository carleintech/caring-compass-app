"use client"

import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  iconClassName?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  ...props
}: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
        className
      )} 
      {...props}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={cn(
            "rounded-lg p-2 transition-colors",
            "bg-primary/10 group-hover:bg-primary/20",
            iconClassName
          )}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
