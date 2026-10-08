/**
 * Measures an HTML element in its own (unscaled) CSS pixels.
 *
 * `getBoundingClientRect()` reports the size an element occupies on screen, which includes any
 * CSS `transform` or `zoom` applied to an ancestor (for example a diagram rendered inside a
 * zoomed or pan-zoomed container). Labels are sized and positioned in SVG user units, which are
 * not affected by these, so using the screen size directly makes labels too large or too small
 * for their content and the text gets clipped.
 *
 * When the element is scaled, the returned box keeps the position reported by
 * `getBoundingClientRect()` but has its size converted back to the element's layout size.
 *
 * @param element - The element to measure.
 * @returns The bounding box of the element with its unscaled width and height.
 */
export const getLayoutBox = (element: HTMLElement): DOMRect => {
  const rect = element.getBoundingClientRect();
  const { offsetWidth, offsetHeight } = element;
  if (
    !offsetWidth ||
    !offsetHeight ||
    // offsetWidth/offsetHeight are rounded to whole pixels, so allow for that difference
    (Math.abs(rect.width - offsetWidth) < 1 && Math.abs(rect.height - offsetHeight) < 1)
  ) {
    return rect;
  }
  return {
    x: rect.x,
    y: rect.y,
    width: offsetWidth,
    height: offsetHeight,
    top: rect.top,
    left: rect.left,
    bottom: rect.top + offsetHeight,
    right: rect.left + offsetWidth,
    toJSON: () => ({}),
  } as DOMRect;
};
