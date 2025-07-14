"use client"

import { useRef, ReactNode, HTMLAttributes } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  delay?: number
}

export function AnimatedSection({ children, className, delay = 0, ...props }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1, triggerOnce: true })

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        {
          "opacity-0 translate-y-8": !isVisible,
          "opacity-100 translate-y-0": isVisible,
        },
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}
