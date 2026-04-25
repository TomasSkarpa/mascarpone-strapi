"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showProgressBar, setShowProgressBar] = useState(false)
  const pathname = usePathname()
  const MIN_SCROLL_HEIGHT = 400

  const updateScrollProgress = useCallback(() => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight

    const isScrollable = scrollHeight > MIN_SCROLL_HEIGHT
    setShowProgressBar((previousValue) =>
      previousValue === isScrollable ? previousValue : isScrollable
    )

    if (!isScrollable || scrollHeight <= 0) {
      setScrollProgress(0)
      return
    }

    const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      updateScrollProgress()
    })

    return () => cancelAnimationFrame(frameId)
  }, [pathname, updateScrollProgress])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    const handleUpdate = () => {
      updateScrollProgress()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleUpdate, { passive: true })

    updateScrollProgress()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleUpdate)
    }
  }, [updateScrollProgress])

  if (!showProgressBar) {
    return null
  }

  return (
    <div className="bg-white/90" style={{ height: "3px" }}>
      <div
        className="h-full origin-left bg-[var(--color-brand-red)]/90 transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
    </div>
  )
}
