import ts from 'typescript';
import {Item} from './Item';
import {Reference} from './Reference';

export class ReferenceSearcher {
  private symbolMap: Map<ts.Symbol, Item> = new Map<ts.Symbol, Item>();
  private result: Reference[] = [];
  private contextItem?: Item;

  constructor(private typeChecker: ts.TypeChecker) {}

  search(items: Item[]) {
    this.result = [];
    this.symbolMap = this.createSymbolToItemMap(items);
    this.searchInsideItems(items);

    return this.result;
  }

  private searchInsideItems(items: Item[]) {
    items.forEach(item => {
      this.contextItem = item;
      this.searchInsideNode(item.getNode());
    });
  }

  private searchInsideNode(node: ts.Node) {
    node.forEachChild(child => {
      if (this.isConnection(child)) {
        this.addResult();
      }
      this.searchInsideNode(child);
    });
  }

  private addResult() {
    // TODO
    this.result.push(new Reference({} as Item, {} as Item));
  }

  private isConnection(node: ts.Node): boolean {
    const symbol = this.getSymbol(node);
    return !!symbol && this.isSymbolConnection(symbol);
  }

  private isSymbolConnection(symbol: ts.Symbol): boolean {
    const item = this.getItemForSymbol(symbol);
    return !!item && this.isNotContextItem(item);
  }

  private getItemForSymbol(symbol: ts.Symbol) {
    return this.symbolMap.get(symbol);
  }

  private isNotContextItem(item: Item): boolean {
    return item.getNode() !== this.contextItem?.getNode();
  }

  private getSymbol(node: ts.Node) {
    return this.typeChecker.getSymbolAtLocation(node);
  }

  private createSymbolToItemMap(items: Item[]) {
    return items.reduce((symbolMap, item) => {
      const symbol = this.getSymbol(item.getNode());
      if (symbol) symbolMap.set(symbol, item);
      return symbolMap;
    }, new Map<ts.Symbol, Item>());
  }
}
