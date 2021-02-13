import ts from 'typescript';
import {FoundNode} from './model/FoundNode';
import {TypeChecker} from '../compiler/domain/TypeChecker';

export class FoundNodeCache {
  private symbolMap: Map<ts.Symbol, FoundNode>;

  constructor(private typeChecker: TypeChecker, items: FoundNode[]) {
    this.symbolMap = this.createSymbolToItemMap(items);
  }

  hasItemsToFound() {
    return this.symbolMap.size > 0;
  }

  getItemForNode(node: ts.Node) {
    const symbol = this.typeChecker.getTsSymbol(node);
    return symbol && this.symbolMap.get(symbol);
  }

  private createSymbolToItemMap(items: FoundNode[]) {
    return items.reduce((symbolMap, item) => {
      const symbol = this.typeChecker.getTsSymbol(item.getNode());
      if (symbol) symbolMap.set(symbol, item);
      return symbolMap;
    }, new Map<ts.Symbol, FoundNode>());
  }
}
