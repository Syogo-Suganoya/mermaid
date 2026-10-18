import { FlowDB } from '../flowDb.js';
import flow from './flowParser.ts';
import { setConfig } from '../../../config.js';
import { vi } from 'vitest';
const spyOn = vi.spyOn;

setConfig({
  securityLevel: 'strict',
});

describe('[Interactions] when parsing', () => {
  let flowDb;
  beforeEach(function () {
    flowDb = new FlowDB();
    flow.parser.yy = flowDb;
    flow.parser.yy.clear();
  });

  it('should be possible to use click to a callback', function () {
    spyOn(flowDb, 'setClickEvent');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A callback');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setClickEvent).toHaveBeenCalledWith('A', 'callback');
  });

  it('should be possible to use click to a click and call callback', function () {
    spyOn(flowDb, 'setClickEvent');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A call callback()');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setClickEvent).toHaveBeenCalledWith('A', 'callback');
  });

  it('should be possible to use click to a callback with tooltip', function () {
    spyOn(flowDb, 'setClickEvent');
    spyOn(flowDb, 'setTooltip');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A callback "tooltip"');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setClickEvent).toHaveBeenCalledWith('A', 'callback');
    expect(flowDb.setTooltip).toHaveBeenCalledWith('A', 'tooltip');
  });

  it('should be possible to use click to a click and call callback with tooltip', function () {
    spyOn(flowDb, 'setClickEvent');
    spyOn(flowDb, 'setTooltip');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A call callback() "tooltip"');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setClickEvent).toHaveBeenCalledWith('A', 'callback');
    expect(flowDb.setTooltip).toHaveBeenCalledWith('A', 'tooltip');
  });

  it('should be possible to use click to a callback with an arbitrary number of args', function () {
    spyOn(flowDb, 'setClickEvent');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A call callback("test0", test1, test2)');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setClickEvent).toHaveBeenCalledWith('A', 'callback', '"test0", test1, test2');
  });

  it('should handle interaction - click to a link', function () {
    spyOn(flowDb, 'setLink');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A "click.html"');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html');
  });

  it('should handle interaction - click to a click and href link', function () {
    spyOn(flowDb, 'setLink');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A href "click.html"');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html');
  });

  it('should handle interaction - click to a link with tooltip', function () {
    spyOn(flowDb, 'setLink');
    spyOn(flowDb, 'setTooltip');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A "click.html" "tooltip"');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html');
    expect(flowDb.setTooltip).toHaveBeenCalledWith('A', 'tooltip');
  });

  it('should handle interaction - click to a click and href link with tooltip', function () {
    spyOn(flowDb, 'setLink');
    spyOn(flowDb, 'setTooltip');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A href "click.html" "tooltip"');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html');
    expect(flowDb.setTooltip).toHaveBeenCalledWith('A', 'tooltip');
  });

  it('should handle interaction - click to a link with target', function () {
    spyOn(flowDb, 'setLink');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A "click.html" _blank');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html', '_blank');
  });

  it('should handle interaction - click to a click and href link with target', function () {
    spyOn(flowDb, 'setLink');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A href "click.html" _blank');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html', '_blank');
  });

  it('should handle interaction - click to a link with tooltip and target', function () {
    spyOn(flowDb, 'setLink');
    spyOn(flowDb, 'setTooltip');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A "click.html" "tooltip" _blank');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html', '_blank');
    expect(flowDb.setTooltip).toHaveBeenCalledWith('A', 'tooltip');
  });

  it('should handle interaction - click to a click and href link with tooltip and target', function () {
    spyOn(flowDb, 'setLink');
    spyOn(flowDb, 'setTooltip');
    const res = flow.parser.parse('graph TD\nA-->B\nclick A href "click.html" "tooltip" _blank');

    const vert = flow.parser.yy.getVertices();
    const edges = flow.parser.yy.getEdges();

    expect(flowDb.setLink).toHaveBeenCalledWith('A', 'click.html', '_blank');
    expect(flowDb.setTooltip).toHaveBeenCalledWith('A', 'tooltip');
  });

  describe('a node named click (issue #7023)', () => {
    it.each([
      ['---', 'abc'],
      ['-->', 'abc'],
      ['==>', 'abc'],
      ['-.->', 'abc'],
      ['~~~', 'abc'],
      ['<-->', 'abc'],
      ['x--x', 'abc'],
      ['o--o', 'abc'],
      ['-- text -->', 'abc'],
    ])('should parse "click %s %s" as a link from the node click', (link, target) => {
      spyOn(flowDb, 'setClickEvent');
      flow.parser.parse(`flowchart LR\n    click ${link} ${target};`);

      const edges = flow.parser.yy.getEdges();
      expect(edges).toHaveLength(1);
      expect(edges[0].start).toBe('click');
      expect(edges[0].end).toBe(target);
      expect(flowDb.setClickEvent).not.toHaveBeenCalled();
    });

    it('should parse a node named click chained with &', () => {
      flow.parser.parse('flowchart LR\n    click & a --> b');

      const edges = flow.parser.yy.getEdges();
      expect(edges.map(({ start, end }) => `${start}-${end}`)).toEqual(['click-b', 'a-b']);
    });

    it('should still parse click statements separated by several spaces', () => {
      spyOn(flowDb, 'setClickEvent');
      flow.parser.parse('graph TD\nA-->B\nclick    A callback');

      expect(flowDb.setClickEvent).toHaveBeenCalledWith('A', 'callback');
    });
  });
});
