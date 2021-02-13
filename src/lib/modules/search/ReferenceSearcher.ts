import ts from 'typescript';
import {FoundNode} from './model/FoundNode';
import {TypeChecker} from '../compiler/domain/TypeChecker';
import {ReferenceSearcherContext} from './ReferenceSearcherContext';
import {Node} from '../compiler/domain/Node';

export class ReferenceSearcher {
  constructor(private typeChecker: TypeChecker) {}

  search(items: FoundNode[]) {
    const context = this.createContext(items);
    return context.hasItemsToFound()
      ? this.searchInsideItems(items, context)
      : [];
  }

  private createContext(items: FoundNode[]) {
    return new ReferenceSearcherContext(this.typeChecker, items);
  }

  private searchInsideItems(
    items: FoundNode[],
    context: ReferenceSearcherContext
  ) {
    items.forEach(item => {
      context.setContextFoundNode(item);
      this.searchInsideTsNode(item.getTsNode(), context);
    });

    return context.getResult();
  }

  private searchInsideTsNode(node: ts.Node, context: ReferenceSearcherContext) {
    node.forEachChild(child => {
      const connectedItem = context.getConnectedItemToTsNode(child);
      if (connectedItem) {
        context.addReference(connectedItem, child);
      }
      this.searchInsideTsNode(child, context);
    });
  }

  private searchInsideNode(node: Node, context: ReferenceSearcherContext) {
    node.forEachChild(child => {
      const connectedItem = context.getConnectedItem(child);
      if (connectedItem) {
        context.addReference(connectedItem, child.internal);
      }
      this.searchInsideNode(child, context);
    });
  }
}

export class ReferenceSearcherError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceSearcherError.prototype);
  }
}
