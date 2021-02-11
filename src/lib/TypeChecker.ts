import ts from 'typescript';

interface NodeWithSymbol extends ts.Node {
  symbol?: ts.Symbol;
}

export class TypeChecker {
  get tsTypeChecker() {
    return this.typeChecker;
  }

  constructor(private typeChecker: ts.TypeChecker) {}

  getSymbol(node: ts.Node) {
    const symbol =
      this.getSymbolAssignToNode(node) ||
      this.typeChecker.getSymbolAtLocation(node);

    //  TODO: check if should get from name
    // ||
    // ((item.getNode() as any).name &&
    //   this.getSymbol((item.getNode() as any).name));
    return symbol && this.skipAliasses(symbol);
  }

  private getSymbolAssignToNode(node: NodeWithSymbol) {
    return node.symbol;
  }

  private skipAliasses(symbol: ts.Symbol) {
    while (this.isAlias(symbol)) {
      const aliasedSymbol = this.typeChecker.getAliasedSymbol(symbol);
      if (this.typeChecker.isUnknownSymbol(aliasedSymbol)) {
        break;
      }
      symbol = aliasedSymbol;
    }
    return symbol;
  }

  private isAlias(symbol: ts.Symbol) {
    return symbol.flags & ts.SymbolFlags.AliasExcludes;
  }
}
