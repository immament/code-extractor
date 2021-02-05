import ts from 'typescript';
import {Item} from './Item';

export class ConnectionSearcher {
  constructor(private typeChecker: ts.TypeChecker) {}

  search(items: Item[]) {
    const typeChecker = this.typeChecker;
    const result: Connection[] = [];
    const symbolMap = this.createSymbolToItemMap(items);
    let contextItem: Item;
    searchInsideItems(items);

    function searchInsideItems(items: Item[]) {
      items.forEach(item => {
        contextItem = item;

        searchInsideNode(item.getNode());
      });
    }

    function searchInsideNode(node: ts.Node) {
      node.forEachChild(child => {
        if (isConnection(child)) {
          result.push(new Connection({} as Item, {} as Item));
        }
        searchInsideNode(child);
      });
    }

    function isConnection(node: ts.Node): boolean {
      const symbol = getSymbol(node);
      return !!symbol && isSymbolConnection(symbol);
    }

    function isSymbolConnection(symbol: ts.Symbol): boolean {
      const item = getItemForSymbol(symbol);
      return !!item && isNotContextItem(item);
    }

    function getItemForSymbol(symbol: ts.Symbol) {
      return symbolMap.get(symbol);
    }

    function isNotContextItem(item: Item): boolean {
      return item.getNode() !== contextItem.getNode();
    }

    function getSymbol(node: ts.Node) {
      return typeChecker.getSymbolAtLocation(node);
    }

    return result;
  }

  private createSymbolToItemMap(items: Item[]) {
    const symbolMap = new Map<ts.Symbol, Item>();
    items.forEach(item => {
      const symbol = this.typeChecker.getSymbolAtLocation(item.getNode());
      if (symbol) {
        symbolMap.set(symbol, item);
      }
    });
    return symbolMap;
  }
}

export class Connection {
  constructor(public from: Item, public to: Item) {}
}
