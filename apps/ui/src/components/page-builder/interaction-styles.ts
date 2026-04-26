/**
 * Reusable hover / focus-visible / active patterns for page-builder and related UI.
 * Prefer `focus-visible` so mouse users are not shown a focus ring on click.
 */
/**
 * Fills the adaptive-gallery aspect cell the same for `<a>` and `<button>` tiles: without
 * `h-full` + `min-h-0` + `overflow-hidden`, the button path sizes to the image and rows look uneven.
 */
const pageBuilderImageTileShell =
  "group block h-full w-full min-h-0 min-w-0 max-w-full overflow-hidden rounded-lg outline-none " +
  "hover:shadow-md " +
  "focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 " +
  "dark:focus-visible:ring-primary-500 "

export const pageBuilderImageTileButton =
  pageBuilderImageTileShell +
  "cursor-pointer transition-[transform,box-shadow] outline-offset-2 " +
  "active:scale-[0.99] "

export const pageBuilderImageTileLinkBlock =
  pageBuilderImageTileShell +
  "transition-shadow " +
  "active:opacity-95 "

export const pageBuilderCarouselNavButtonClass =
  "inline-flex min-h-11 min-w-11 select-none items-center justify-center rounded-full p-2 text-white shadow-sm " +
  "border border-white/20 bg-black/70 " +
  "cursor-pointer touch-manipulation " +
  "transition-[transform,background-color,box-shadow] " +
  "hover:bg-black/85 hover:shadow-md " +
  "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/90 " +
  "active:scale-95 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30 sm:min-h-12 sm:min-w-12 sm:p-3"

export const pageBuilderCarouselDotClass =
  "inline-flex h-10 w-10 items-center justify-center touch-manipulation rounded-full " +
  "transition-transform outline-none " +
  "hover:bg-gray-200/50 " +
  "focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 " +
  "active:scale-90 " +
  "disabled:opacity-40 " +
  "dark:hover:bg-white/10 dark:focus-visible:ring-primary-500"

export const pageBuilderLoadMoreButtonClass =
  "rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm " +
  "cursor-pointer touch-manipulation transition-all " +
  "hover:bg-red-600 hover:shadow-md " +
  "focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 " +
  "active:scale-[0.99] active:bg-red-700 " +
  "dark:focus-visible:ring-primary-500"

/** FAQ row trigger: same light-UI look in light and dark (white cards, dark type) */
export const pageBuilderFaqTriggerClass =
  "cursor-pointer rounded-t-lg border-0 text-left text-base font-semibold " +
  "text-gray-900 dark:text-gray-900 " +
  "bg-transparent " +
  "hover:bg-gray-50/90 hover:text-gray-900 " +
  "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 " +
  "data-[state=open]:bg-gray-50/90 data-[state=open]:text-gray-900 " +
  "dark:hover:bg-gray-50/90 dark:hover:text-gray-900 " +
  "dark:data-[state=open]:bg-gray-50/90 dark:data-[state=open]:text-gray-900 " +
  "dark:focus-visible:ring-primary-500 " +
  "[&>svg]:shrink-0 [&>svg]:text-gray-500 dark:[&>svg]:text-gray-500"
