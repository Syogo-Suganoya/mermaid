// @ts-expect-error Jison doesn't export types
import { parser } from './parser/classDiagram.jison';
import { describe, expect, it } from 'vitest';
import { ClassDB } from './classDb.js';
import getStyles from './styles.js';

describe('class diagram notes (issue #7131)', () => {
  const noteNodes = () => {
    const classDb = new ClassDB();
    parser.yy = classDb;
    parser.parse('classDiagram\n  note "A note"\n  class Duck\n  note for Duck "can fly"');
    return classDb.getData().nodes.filter((node) => node.shape === 'note');
  };

  it('does not inline the theme colours of notes', () => {
    const notes = noteNodes();
    expect(notes).toHaveLength(2);
    for (const note of notes) {
      expect(note.cssStyles?.join(';')).not.toMatch(/fill|stroke/);
      expect(note.cssClasses).toBe('classDiagram-note');
    }
  });

  it('colours notes from the stylesheet', () => {
    const css: string = getStyles({ noteBkgColor: '#fff5ad', noteBorderColor: '#aaaa33' });
    expect(css).toMatch(
      /g\.node\.classDiagram-note path {\s*fill: #fff5ad;\s*stroke: #aaaa33;\s*}/
    );
  });
});
