import ts from 'typescript';
import {Item} from './Item';
import {Reference} from './Reference';

export class ReferenceSearcher {
  constructor(private typeChecker: ts.TypeChecker) {}

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
        context.addReference(connectedItem);
      }
      this.searchInsideNode(child, context);
    });
  }
}

export class ReferenceSearcherContext {
  #contextItem?: Item;
  private result: Reference[] = [];
  private symbolMap: Map<ts.Symbol, Item>;

  private get contextItem() {
    if (!this.#contextItem) {
      throw new ReferenceSearcherError('Context item not set');
    }
    return this.#contextItem;
  }

  constructor(private typeChecker: ts.TypeChecker, items: Item[]) {
    this.symbolMap = this.createSymbolToItemMap(items);
  }

  setContextItem(item: Item) {
    this.#contextItem = item;
  }

  getResult() {
    return this.result;
  }

  addReference(item: Item) {
    this.result.push(new Reference(this.contextItem, item));
  }

  hasItemsToFound() {
    return this.symbolMap.size > 0;
  }

  getConnectedItem(node: ts.Node): Item | undefined {
    const symbol = this.getSymbol(node);
    const item = symbol && this.getItemForSymbol(symbol);
    return item && this.isNotContextItem(item) ? item : undefined;
  }

  private getItemForSymbol(symbol: ts.Symbol) {
    return this.symbolMap.get(symbol);
  }

  private isNotContextItem(item: Item): boolean {
    return item.getNode() !== this.contextItem.getNode();
  }

  private getSymbol(node: ts.Node) {
    return (
      (node as {symbol?: ts.Symbol}).symbol ||
      this.typeChecker.getSymbolAtLocation(node)
      //  TODO: check if should get from name
      // ||
      // ((item.getNode() as any).name &&
      //   this.getSymbol((item.getNode() as any).name));
    );
  }

  private createSymbolToItemMap(items: Item[]) {
    return items.reduce((symbolMap, item) => {
      const symbol = this.getSymbol(item.getNode());
      if (symbol) symbolMap.set(symbol, item);
      return symbolMap;
    }, new Map<ts.Symbol, Item>());
  }
}

export class ReferenceSearcherError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceSearcherError.prototype);
  }
}
