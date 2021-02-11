import ts from 'typescript';
import {Item} from './Item';
import {ItemCache} from './ItemCache';
import {Reference} from './Reference';
import {TypeChecker} from './TypeChecker';

export class ReferenceSearcher {
  constructor(private typeChecker: TypeChecker) {}

  search(items: Item[]) {
    const context = this.createContext(items);
    return context.hasItemsToFound()
      ? this.searchInsideItems(items, context)
      : [];
  }

  private createContext(items: Item[]) {
    return new ReferenceSearcherContext(this.typeChecker, items);
  }

  private searchInsideItems(items: Item[], context: ReferenceSearcherContext) {
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
  #contextItem?: Item;
  private result: Reference[] = [];
  private itemCache: ItemCache;

  private get contextItem() {
    if (!this.#contextItem) {
      throw new ReferenceSearcherError('Context item not set');
    }
    return this.#contextItem;
  }

  constructor(typeChecker: TypeChecker, items: Item[]) {
    this.itemCache = new ItemCache(typeChecker, items);
  }

  setContextItem(item: Item) {
    this.#contextItem = item;
  }

  getResult() {
    return this.result;
  }

  addReference(item: Item, fromNode?: ts.Node) {
    const reference = new Reference(this.contextItem, item);
    reference.fromNode = fromNode;
    this.result.push(reference);
  }

  hasItemsToFound() {
    return this.itemCache.hasItemsToFound();
  }

  getConnectedItem(node: ts.Node): Item | undefined {
    const item = this.itemCache.getItemForNode(node);
    if (item && this.isNotContextItem(item)) return item;
    return;
  }

  private isNotContextItem(item: Item): boolean {
    return item.getNode() !== this.contextItem.getNode();
  }
}

export class ReferenceSearcherError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceSearcherError.prototype);
  }
}
