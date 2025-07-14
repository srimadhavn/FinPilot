"use client"

import { useState, useEffect, RefObject } from "react"

interface IntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false)
  const { threshold = 0.1, root = null, rootMargin = "0px", triggerOnce = true } = options

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true)
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current)
          }
        } else {
          if (!triggerOnce) {
            setIntersecting(false)
          }
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref, threshold, root, rootMargin, triggerOnce])

  return isIntersecting
}
