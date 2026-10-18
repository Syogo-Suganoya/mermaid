import { describe, expect, it } from 'vitest';
import getStyles from './styles.js';

describe('class diagram cardinality colour (issue #1989)', () => {
  const baseOptions = { textColor: '#333', lineColor: '#333', mainBkg: '#fff' };

  it('colours the cardinality labels with classCardinalityText', () => {
    const css: string = getStyles({ ...baseOptions, classCardinalityText: '#ff8800' });
    expect(css).toMatch(
      /\.edgeTerminals text, \.edgeTerminals tspan {\s*fill: #ff8800 !important;/
    );
    expect(css).toMatch(/\.edgeTerminals p {\s*color: #ff8800 !important;/);
  });

  it('leaves the cardinality labels alone when classCardinalityText is not set', () => {
    const css: string = getStyles(baseOptions);
    expect(css).not.toContain('.edgeTerminals text');
  });
});
