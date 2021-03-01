import {Cache} from '@imm/ts-common/src/lib/common/Cache';
import {Node} from '@imm/ts-common/src/lib/modules/compiler/domain/Node';
import {SymbolIml} from '@imm/ts-common/src/lib/modules/compiler/domain/SymbolIml';
import {FoundNode} from './model/FoundNode';

export class FoundNodeCache {
  private cache = new Cache<SymbolIml, FoundNode>();

  constructor(items: FoundNode[]) {
    this.fillSymbolToItemCache(items);
  }

  hasItemsToFound() {
    return this.cache.isEmpty();
  }

  getItemForNode(node: Node) {
    const symbol = node.getSymbol();
    return symbol && this.cache.get(symbol);
  }

  private fillSymbolToItemCache(items: FoundNode[]) {
    items.forEach(item => {
      const symbol = item.getNode().getSymbol();
      symbol && this.cache.set(symbol, item);
    });
  }
}
