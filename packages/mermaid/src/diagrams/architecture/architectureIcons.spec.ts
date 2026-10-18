import { describe, expect, it } from 'vitest';
import { architectureIcons } from './architectureIcons.js';

describe('architecture built-in icons', () => {
  it.each(['client', 'firewall', 'gateway', 'loadbalancer', 'queue', 'router', 'wifi'])(
    'provides the %s icon (issue #6019)',
    (name) => {
      const body = architectureIcons.icons[name]?.body;
      expect(body).toBeDefined();
      // Same style as the other built-in icons: white strokes on the blue 80x80 tile.
      expect(body).toMatch(/^<g><rect width="80" height="80" style="fill: #087ebf;/);
      expect(body).toContain('stroke: #fff');
    }
  );
});
