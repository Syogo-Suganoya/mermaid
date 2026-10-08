import { describe, expect, it } from 'vitest';
import { getLayoutBox } from './getLayoutBox.js';

const createElement = (
  rect: { x: number; y: number; width: number; height: number },
  offsetWidth: number,
  offsetHeight: number
) => {
  const element = document.createElement('div');
  element.getBoundingClientRect = () =>
    ({
      ...rect,
      top: rect.y,
      left: rect.x,
      bottom: rect.y + rect.height,
      right: rect.x + rect.width,
      toJSON: () => ({}),
    }) as DOMRect;
  Object.defineProperty(element, 'offsetWidth', { value: offsetWidth });
  Object.defineProperty(element, 'offsetHeight', { value: offsetHeight });
  return element;
};

describe('getLayoutBox', () => {
  it('should return the bounding client rect when the element is not scaled', () => {
    const element = createElement({ x: 10, y: 20, width: 120.4, height: 63 }, 120, 63);
    const box = getLayoutBox(element);
    expect(box.width).toBe(120.4);
    expect(box.height).toBe(63);
  });

  it('should return the unscaled size when an ancestor is zoomed in (issue #7354)', () => {
    const element = createElement({ x: 10, y: 20, width: 150, height: 78.75 }, 120, 63);
    const box = getLayoutBox(element);
    expect(box).toMatchObject({ x: 10, y: 20, left: 10, top: 20, width: 120, height: 63 });
  });

  it('should return the unscaled size when an ancestor is scaled down (issue #7354)', () => {
    const element = createElement({ x: 0, y: 0, width: 96, height: 50.4 }, 120, 63);
    const box = getLayoutBox(element);
    expect(box.width).toBe(120);
    expect(box.height).toBe(63);
  });

  it('should fall back to the bounding client rect when there is no layout size', () => {
    const element = createElement({ x: 0, y: 0, width: 50, height: 20 }, 0, 0);
    expect(getLayoutBox(element).width).toBe(50);
  });
});
