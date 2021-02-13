import ts from 'typescript';

interface NodeWithSymbol extends ts.Node {
  symbol?: ts.Symbol;
}

export class TypeChecker {
  public get tsTypeChecker(): ts.TypeChecker {
    return this._tsTypeChecker;
  }

  constructor(private _tsTypeChecker: ts.TypeChecker) {}

  getTsSymbol(node: ts.Node) {
    const symbol =
      this.getSymbolAssignToNode(node) ||
      this.tsTypeChecker.getSymbolAtLocation(node);

    //  TODO: check if should get from name
    // ||
    // ((item.getNode() as any).name &&
    //   this.getSymbol((item.getNode() as any).name));
    return symbol && this.skipAliasses(symbol);
  }

  getExportsOfModule(symbol: ts.Symbol) {
    return this.tsTypeChecker.getExportsOfModule(symbol);
  }

  private getSymbolAssignToNode(node: NodeWithSymbol) {
    return node.symbol;
  }

  private skipAliasses(symbol: ts.Symbol) {
    while (this.isAlias(symbol)) {
      const aliasedSymbol = this.tsTypeChecker.getAliasedSymbol(symbol);
      if (this.tsTypeChecker.isUnknownSymbol(aliasedSymbol)) {
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
