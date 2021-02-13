import {Node} from '../compiler/domain/Node';
import {TypeChecker} from '../compiler/domain/TypeChecker';
import {FoundNode} from './model/FoundNode';
import {ReferenceSearcherContext} from './ReferenceSearcherContext';

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
      this.searchInsideNode(item.getNode(), context);
    });

    return context.getResult();
  }

  private searchInsideNode(node: Node, context: ReferenceSearcherContext) {
    node.forEachChild(child => {
      const connectedItem = context.getConnectedItem(child);
      if (connectedItem) {
        context.addReference(connectedItem, child.internal);
      }
      this.searchInsideNode(child, context);
      return undefined;
    });
  }
}

export class ReferenceSearcherError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceSearcherError.prototype);
  }
}
