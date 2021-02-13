import ts from 'typescript';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {SymbolIml} from './SymbolIml';

interface NodeWithSymbol extends ts.Node {
  symbol?: ts.Symbol;
}

export class TypeChecker {
  private symbolCache = new Map<Node, SymbolIml>();

  public get tsTypeChecker(): ts.TypeChecker {
    return this._tsTypeChecker;
  }

  constructor(
    private context: ProgramContext,
    private _tsTypeChecker: ts.TypeChecker
  ) {}

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

  getSymbol(node: Node): SymbolIml | undefined {
    return this.symbolCache.get(node) ?? this.loadSymbol(node);
  }

  private loadSymbol(node: Node): SymbolIml | undefined {
    const tsSymbol = this.getTsSymbol(node.internal);
    if (tsSymbol) {
      const symbol = new SymbolIml(this.context, tsSymbol);
      this.symbolCache.set(node, symbol);
      return symbol;
    }
    return;
  }

  getExportsOfModule(symbol: SymbolIml) {
    return this.tsTypeChecker.getExportsOfModule(symbol.internal);
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
