import ts from 'typescript';

export function nodeToString(node: ts.Node, level = 0) {
  let result = ' '.repeat(level) + ts.SyntaxKind[node.kind] + '\n';
  node.forEachChild(child => {
    result += nodeToString(child, level + 1);
  });
  return result;
}
