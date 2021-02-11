import ts from 'typescript';
import {Item} from './Item';
import {TypeChecker} from './TypeChecker';

export class ItemCache {
  private symbolMap: Map<ts.Symbol, Item>;

  constructor(private typeChecker: TypeChecker, items: Item[]) {
    this.symbolMap = this.createSymbolToItemMap(items);
  }

  hasItemsToFound() {
    return this.symbolMap.size > 0;
  }

  getItemForNode(node: ts.Node) {
    const symbol = this.typeChecker.getSymbol(node);
    return symbol && this.symbolMap.get(symbol);
  }

  private createSymbolToItemMap(items: Item[]) {
    return items.reduce((symbolMap, item) => {
      const symbol = this.typeChecker.getSymbol(item.getNode());
      if (symbol) symbolMap.set(symbol, item);
      return symbolMap;
    }, new Map<ts.Symbol, Item>());
  }
}
