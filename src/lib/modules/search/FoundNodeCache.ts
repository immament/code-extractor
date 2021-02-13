import {Node} from '../compiler/domain/Node';
import {SymbolIml} from '../compiler/domain/SymbolIml';
import {FoundNode} from './model/FoundNode';

export class FoundNodeCache {
  // private tsSymbolMap: Map<ts.Symbol, FoundNode>;
  private symbolMap: Map<SymbolIml, FoundNode>;

  constructor(items: FoundNode[]) {
    //this.tsSymbolMap = this.createTsSymbolToItemMap(items);
    this.symbolMap = this.createSymbolToItemMap(items);
  }

  hasItemsToFound() {
    return this.symbolMap.size > 0;
  }

  getItemForNode(node: Node) {
    const symbol = node.getSymbol();
    return symbol && this.symbolMap.get(symbol);
  }

  private createSymbolToItemMap(items: FoundNode[]) {
    return items.reduce((symbolMap, item) => {
      const symbol = item.getNode().getSymbol();
      if (symbol) symbolMap.set(symbol, item);
      return symbolMap;
    }, new Map<SymbolIml, FoundNode>());
  }

  // getItemForTsNode(node: ts.Node) {
  //   const symbol = this.typeChecker.getTsSymbol(node);
  //   return symbol && this.tsSymbolMap.get(symbol);
  // }

  // private createTsSymbolToItemMap(items: FoundNode[]) {
  //   return items.reduce((symbolMap, item) => {
  //     const symbol = this.typeChecker.getTsSymbol(item.getTsNode());
  //     if (symbol) symbolMap.set(symbol, item);
  //     return symbolMap;
  //   }, new Map<ts.Symbol, FoundNode>());
  // }
}
