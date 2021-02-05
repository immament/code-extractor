import ts from 'typescript';
import {TsNode} from '../Node';
import {SyntaxKind} from '../SyntaxKind';

const deafultNodeKind = SyntaxKind.AbstractKeyword;

function createDefaultNode(childs?: ts.Node[]) {
  return new TsNode(createDefaultTsNode(childs));
}

function createDefaultTsNode(childs?: ts.Node[]) {
  return {
    kind: deafultNodeKind,
    forEachChild: cb => {
      if (childs) {
        childs.forEach(node => cb(node));
      }
    },
  } as ts.Node;
}

test('should getKind returns Syntax Kind from internal ts.Node', () => {
  const syntaxKind = SyntaxKind.AbstractKeyword;
  const node = new TsNode({
    kind: syntaxKind,
  } as ts.Node);

  expect(node.getKind()).toBe(syntaxKind);
});

test('should forEachChild visit all childs  of ts.Node', () => {
  const node = createDefaultNode([
    createDefaultTsNode(),
    createDefaultTsNode(),
  ]);

  let visitedNodesCount = 0;
  node.forEachChild(() => visitedNodesCount++);

  expect(visitedNodesCount).toBe(2);
});

test('should forEachChild call forEachChild for all childs', () => {
  const childNodes = [createDefaultTsNode(), createDefaultTsNode()];
  const node = createDefaultNode(childNodes);

  let childIndex = 0;
  node.forEachChild(childNode =>
    expect(childNode.tsNode).toEqual(childNodes[childIndex++])
  );
});
