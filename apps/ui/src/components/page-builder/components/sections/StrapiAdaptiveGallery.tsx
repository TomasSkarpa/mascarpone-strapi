"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

import type { Data } from "@repo/strapi-types"

import { cn } from "@/lib/styles"
import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  pageBuilderCarouselDotClass,
  pageBuilderCarouselNavButtonClass,
  pageBuilderImageTileButton,
  pageBuilderImageTileLinkBlock,
  pageBuilderLoadMoreButtonClass,
} from "@/components/page-builder/interaction-styles"
import {
  pageBuilderSectionIntroClass,
  pageBuilderSectionTitleClass,
  pageBuilderSectionY,
} from "@/components/page-builder/section-layout"
import { ImageGallery } from "@/components/ui/ImageGallery"

type GalleryImageItem = NonNullable<
  Data.Component<"sections.adaptive-gallery">["images"]
>[number]

export function StrapiAdaptiveGallery({
  component,
}: {
  readonly component: Data.Component<"sections.adaptive-gallery">
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)

  const desktopCols = parseInt(
    (component.desktopColumns || "3").split(" ")[0] || "3"
  )
  const mobileCols = parseInt(
    (component.mobileColumns || "2").split(" ")[0] || "2"
  )
  const isMobileSlider = (component.mobileLayout || "").startsWith("slider")
  const isDesktopSlider = (component.desktopLayout || "").startsWith("slider")
  const isAutoAspect = (component.imageAspectRatio || "").startsWith("auto")

  const IMAGES_LIMIT = 12
  // Omit gallery rows that reference the removed/missing `networks_coach` file on the CMS
  const BROKEN_GALLERY_FILE = /networks[._-]coach/i
  const allImages = (component.images || []).filter((row) => {
    const media = row.image?.media
    if (!media || typeof media !== "object") {
      return true
    }
    const meta = [media.name, media.url, media.hash]
      .filter((x): x is string => typeof x === "string")
      .join(" ")
    return !BROKEN_GALLERY_FILE.test(meta)
  })
  const displayedImages = showAll ? allImages : allImages.slice(0, IMAGES_LIMIT)
  const hasMore = allImages.length > IMAGES_LIMIT

  const getContainerClass = () => {
    const aspectRatioValue =
      (component.imageAspectRatio || "").split(" ")[0] || "auto"
    const aspectRatioMap = {
      square: "md:aspect-square",
      portrait: "md:aspect-[3/4]",
      landscape: "md:aspect-[4/3]",
      auto: "",
    } as const
    const aspectRatio =
      aspectRatioMap[aspectRatioValue as keyof typeof aspectRatioMap] || ""

    if (isAutoAspect) {
      return "overflow-hidden"
    }

    return `relative overflow-hidden ${aspectRatio} flex items-center justify-center`.trim()
  }

  const getImageProps = (): {
    className: string
    fill: false
  } => ({
    className: isAutoAspect
      ? "w-full rounded-lg object-contain"
      : "w-full h-full rounded-lg object-cover object-center",
    fill: false,
  })

  const getGapClass = () => {
    const gapMap = {
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    }
    const gap = parseInt((component.gap || "4").split(" ")[0] || "4")
    return gapMap[gap as keyof typeof gapMap] || "gap-4"
  }

  const getDesktopGridClass = () => {
    const colsMap = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }
    return `grid ${colsMap[desktopCols as keyof typeof colsMap] || "grid-cols-3"} ${getGapClass()}`
  }

  const getMobileGridClass = () => {
    const colsMap = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
    }
    return `grid ${colsMap[mobileCols as keyof typeof colsMap] || "grid-cols-2"} ${getGapClass()}`
  }

  const nextSlide = () => {
    if (component.images) {
      const maxSlide = isMobileSlider
        ? component.images.length - 1
        : component.images.length - desktopCols
      if (currentSlide < maxSlide) {
        setCurrentSlide(currentSlide + 1)
      }
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setHasDragged(false)
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
    setDragStart(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
    const offset = clientX - dragStart
    setDragOffset(offset)
    if (Math.abs(offset) > 5) {
      setHasDragged(true)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50
    const maxSlide = isMobileSlider
      ? displayedImages.length - 1
      : displayedImages.length - desktopCols

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentSlide > 0) {
        prevSlide()
      } else if (dragOffset < 0 && currentSlide < maxSlide) {
        nextSlide()
      }
    }
    setDragOffset(0)
  }

  const renderImageItem = (
    x: GalleryImageItem,
    i: number,
    imageFieldProps: ReturnType<typeof getImageProps> = {
      className: "w-full rounded-lg object-contain",
      fill: false,
    }
  ) => {
    const { className: baseClass, ...rest } = imageFieldProps
    const imageClass = cn(
      baseClass,
      "transition-opacity group-hover:opacity-90"
    )
    return x.link ? (
      <StrapiLink
        component={x.link}
        plain
        className={pageBuilderImageTileLinkBlock}
      >
        <span className="relative block h-full min-h-0 w-full min-w-0 overflow-hidden rounded-lg">
          <StrapiBasicImage
            component={x.image}
            className={imageClass}
            {...rest}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-end p-1.5 sm:p-2"
            aria-hidden
          >
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-md",
                "border border-white/30 bg-white/90 text-gray-800 shadow-md backdrop-blur-sm",
                "sm:h-8 sm:w-8",
                "transition-transform duration-200 group-hover:scale-110",
                "dark:border-gray-600/50 dark:bg-gray-900/90 dark:text-gray-100"
              )}
            >
              {(x.link as { type?: "page" | "external" }).type ===
              "external" ? (
                <ExternalLink
                  className="size-3.5 sm:size-4"
                  strokeWidth={2.25}
                  aria-hidden
                />
              ) : (
                <ArrowUpRight
                  className="size-3.5 sm:size-4"
                  strokeWidth={2.25}
                  aria-hidden
                />
              )}
            </span>
          </div>
        </span>
      </StrapiLink>
    ) : (
      <button
        type="button"
        className={pageBuilderImageTileButton}
        onClick={() => !hasDragged && setSelectedImage(i)}
        aria-label={`Open image ${i + 1} in lightbox`}
      >
        <StrapiBasicImage
          component={x.image}
          className={imageClass}
          {...rest}
        />
      </button>
    )
  }

  return (
    <section>
      <Container className={pageBuilderSectionY}>
        <div className="flex w-full max-w-6xl flex-col items-center">
          {(component.title || component.subTitle) && (
            <div className="mb-8 w-full text-center sm:mb-10">
              {component.title && (
                <h2
                  className={`mb-4 text-balance sm:mb-5 ${pageBuilderSectionTitleClass}`}
                >
                  {component.title}
                </h2>
              )}
              {component.subTitle && (
                <p className={`text-balance ${pageBuilderSectionIntroClass}`}>
                  {component.subTitle}
                </p>
              )}
            </div>
          )}

          {/* Mobile Slider */}
          {isMobileSlider && (
            <div className="relative w-full md:hidden">
              <div className="mx-12 overflow-hidden rounded-lg">
                <div
                  className={`flex ${isDragging ? "" : "transition-transform duration-300 ease-in-out"}`}
                  style={{
                    transform: `translateX(${Math.max(Math.min(-currentSlide * 100 + (isDragging ? dragOffset / 3 : 0), 0), -(displayedImages.length - 1) * 100)}%)`,
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                  }}
                  role="slider"
                  tabIndex={0}
                  aria-valuenow={currentSlide}
                  aria-valuemin={0}
                  aria-valuemax={displayedImages.length - 1}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {displayedImages.map((x, i) => (
                    <div
                      key={String(x.id) + i}
                      className="w-full flex-shrink-0 px-2"
                    >
                      {renderImageItem(x, i, getImageProps())}
                    </div>
                  ))}
                </div>
              </div>

              {displayedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={cn(
                      "absolute top-1/2 left-0 -translate-y-1/2",
                      pageBuilderCarouselNavButtonClass
                    )}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} className="shrink-0 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    disabled={currentSlide === displayedImages.length - 1}
                    className={cn(
                      "absolute top-1/2 right-0 -translate-y-1/2",
                      pageBuilderCarouselNavButtonClass
                    )}
                    aria-label="Next slide"
                  >
                    <ChevronRight
                      size={20}
                      className="shrink-0 sm:h-6 sm:w-6"
                    />
                  </button>

                  <div className="mt-4 flex flex-wrap justify-center gap-1">
                    {displayedImages.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={pageBuilderCarouselDotClass}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={
                          index === currentSlide ? "true" : undefined
                        }
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full transition-colors",
                            index === currentSlide
                              ? "bg-red-500"
                              : "bg-gray-400 dark:bg-gray-500"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Grid */}
          {!isMobileSlider && (
            <div className="w-full md:hidden">
              <div className={getMobileGridClass()}>
                {displayedImages.map((x, i) => (
                  <div key={String(x.id) + i} className={getContainerClass()}>
                    {renderImageItem(x, i, getImageProps())}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Slider */}
          {isDesktopSlider && (
            <div className="relative hidden w-full md:block">
              <div className="mx-16 overflow-hidden rounded-lg">
                <div
                  className={`flex ${isDragging ? "" : "transition-transform duration-300 ease-in-out"}`}
                  style={{
                    transform: `translateX(${Math.max(Math.min(-currentSlide * (100 / desktopCols) + (isDragging ? dragOffset / desktopCols / 3 : 0), 0), -(displayedImages.length - desktopCols) * (100 / desktopCols))}%)`,
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                  }}
                  role="slider"
                  tabIndex={0}
                  aria-valuenow={currentSlide}
                  aria-valuemin={0}
                  aria-valuemax={Math.max(
                    0,
                    displayedImages.length - desktopCols
                  )}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {displayedImages.map((x, i) => (
                    <div
                      key={String(x.id) + i}
                      className="flex-shrink-0 px-2"
                      style={{ width: `${100 / desktopCols}%` }}
                    >
                      <div className={getContainerClass()}>
                        {renderImageItem(x, i, getImageProps())}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {displayedImages.length > desktopCols && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={cn(
                      "absolute top-1/2 left-0 -translate-y-1/2",
                      pageBuilderCarouselNavButtonClass
                    )}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} className="shrink-0 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    disabled={
                      currentSlide >= displayedImages.length - desktopCols
                    }
                    className={cn(
                      "absolute top-1/2 right-0 -translate-y-1/2",
                      pageBuilderCarouselNavButtonClass
                    )}
                    aria-label="Next slide"
                  >
                    <ChevronRight
                      size={20}
                      className="shrink-0 sm:h-6 sm:w-6"
                    />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Desktop Grid */}
          {!isDesktopSlider && (
            <div className="hidden w-full md:block">
              <div className={getDesktopGridClass()}>
                {displayedImages.map((x, i) => (
                  <div key={String(x.id) + i} className={getContainerClass()}>
                    {renderImageItem(x, i, getImageProps())}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={cn("mt-6", pageBuilderLoadMoreButtonClass)}
            >
              Load More ({allImages.length - IMAGES_LIMIT} more)
            </button>
          )}
        </div>
      </Container>

      {allImages.length > 0 && (
        <ImageGallery
          images={allImages}
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onSelectImage={setSelectedImage}
        />
      )}
    </section>
  )
}

StrapiAdaptiveGallery.displayName = "StrapiAdaptiveGallery"

export default StrapiAdaptiveGallery
