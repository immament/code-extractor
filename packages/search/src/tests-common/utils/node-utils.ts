import {Node} from '@lib/modules/compiler/domain/Node';

export function searchNode(
  node: Node,
  isSearchedNode: (node: Node) => boolean
): Node | undefined {
  return isSearchedNode(node)
    ? node
    : node.forEachChild(child => searchNode(child, isSearchedNode));
}

export function searchNodes(
  node: Node,
  isSearchedNode: (node: Node) => boolean
): Node[] {
  const result: Node[] = [];

  function search(node: Node, isSearchedNode: (node: Node) => boolean) {
    if (isSearchedNode(node)) {
      result.push(node);
      return;
    }
    node.forEachChild(child => {
      search(child, isSearchedNode);
    });
  }

  search(node, isSearchedNode);

  return result;
}
