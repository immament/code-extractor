import ts from 'typescript';
import {Node, TsNode} from '../Node';
import {TsSourceFile} from '../TsSourceFile';

function createDefaultNode() {
  return new TsNode({} as ts.Node);
}

test('should visit all childs', () => {
  const sourceFile = new TsSourceFile([
    createDefaultNode(),
    createDefaultNode(),
    createDefaultNode(),
    createDefaultNode(),
  ]);
  let visitedNodesCount = 0;
  sourceFile.forEachChild(() => visitedNodesCount++);

  expect(visitedNodesCount).toBe(4);
});

test('should forEachChild call forEachChild for all childs', () => {
  const childNodes = [createDefaultNode(), createDefaultNode()];
  const sourceFile = new TsSourceFile(childNodes);

  const callbacNodes: Node[] = [];
  sourceFile.forEachChild(node => callbacNodes.push(node));

  expect(childNodes).toEqual(callbacNodes);
});
