import ts from 'typescript';
import {FoundNode} from './model/FoundNode';
import {FoundNodeCache} from './ItemCache';
import {Reference} from './model/Reference';
import {TypeChecker} from '../compiler/domain/TypeChecker';

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
      context.setContextItem(item);
      this.searchInsideNode(item.getNode(), context);
    });

    return context.getResult();
  }

  private searchInsideNode(node: ts.Node, context: ReferenceSearcherContext) {
    node.forEachChild(child => {
      const connectedItem = context.getConnectedItem(child);
      if (connectedItem) {
        context.addReference(connectedItem, child);
      }
      this.searchInsideNode(child, context);
    });
  }
}

export class ReferenceSearcherContext {
  #contextItem?: FoundNode;
  private result: Reference[] = [];
  private itemCache: FoundNodeCache;

  private get contextItem() {
    if (!this.#contextItem) {
      throw new ReferenceSearcherError('Context item not set');
    }
    return this.#contextItem;
  }

  constructor(typeChecker: TypeChecker, items: FoundNode[]) {
    this.itemCache = new FoundNodeCache(typeChecker, items);
  }

  setContextItem(item: FoundNode) {
    this.#contextItem = item;
  }

  getResult() {
    return this.result;
  }

  addReference(item: FoundNode, fromNode?: ts.Node) {
    const reference = new Reference(this.contextItem, item);
    reference.fromNode = fromNode;
    this.result.push(reference);
  }

  hasItemsToFound() {
    return this.itemCache.hasItemsToFound();
  }

  getConnectedItem(node: ts.Node): FoundNode | undefined {
    const item = this.itemCache.getItemForNode(node);
    if (item && this.isNotContextItem(item)) return item;
    return;
  }

  private isNotContextItem(item: FoundNode): boolean {
    return item.getNode() !== this.contextItem.getNode();
  }
}

export class ReferenceSearcherError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceSearcherError.prototype);
  }
}
