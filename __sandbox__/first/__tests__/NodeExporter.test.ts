import ts from 'typescript';
import {TsNode} from '../Node';
import {NodeExporter} from '../NodeExporter';

jest.mock('../Node');

test('should export node ', () => {
  const nodeExporter = new NodeExporter();
  expect(nodeExporter.export(new TsNode({} as ts.Node))).toBeTruthy();
});
