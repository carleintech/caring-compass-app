"use client"

import { HTMLAttributes } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  className?: string
  children?: React.ReactNode
}

export function HeroSection({
  title,
  description,
  imageSrc,
  imageAlt,
  className,
  children,
  ...props
}: HeroSectionProps) {
  return (
    <section 
      className={cn(
        "relative overflow-hidden bg-background py-20",
        className
      )} 
      {...props}
    >
      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {title}
              </h1>
              <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
                {description}
              </p>
            </div>
            {children}
          </div>
          {imageSrc && (
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[500px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt || ""}
                  fill
                  className="absolute inset-0 object-cover w-full h-full rounded-2xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none" 
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      </div>
    </section>
  )
}
