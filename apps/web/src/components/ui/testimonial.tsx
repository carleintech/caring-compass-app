"use client"

import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Star } from "lucide-react"

interface TestimonialProps extends HTMLAttributes<HTMLDivElement> {
  content: string
  author: string
  role?: string
  avatarSrc?: string
  rating?: number
  className?: string
}

export function Testimonial({
  content,
  author,
  role,
  avatarSrc,
  rating = 5,
  className,
  ...props
}: TestimonialProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        className
      )} 
      {...props}
    >
      <CardContent className="pt-6">
        {rating && (
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: rating }).map((_, i) => (
              <Star 
                key={i} 
                className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                aria-hidden="true"
              />
            ))}
          </div>
        )}
        <blockquote className="text-lg mb-6">{content}</blockquote>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{author}</div>
            {role && <div className="text-sm text-muted-foreground">{role}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
