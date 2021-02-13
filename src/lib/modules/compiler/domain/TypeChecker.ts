import ts from 'typescript';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {SymbolIml} from './SymbolIml';

interface NodeWithSymbol extends ts.Node {
  symbol?: ts.Symbol;
}

export class TypeChecker {
  private nodeToSymbolCache = new Map<Node, SymbolIml>();
  private tsSymbolToSymbolCache = new Map<ts.Symbol, SymbolIml>();

  public get tsTypeChecker(): ts.TypeChecker {
    return this._tsTypeChecker;
  }

  constructor(
    private context: ProgramContext,
    private _tsTypeChecker: ts.TypeChecker
  ) {}

  getSymbol(node: Node): SymbolIml | undefined {
    return this.nodeToSymbolCache.get(node) ?? this.loadSymbol(node);
  }

  getExportsOfModule(symbol: SymbolIml) {
    return this.tsTypeChecker
      .getExportsOfModule(symbol.internal)
      .map(s => this.getOrCreate(s));
  }

  private loadSymbol(node: Node): SymbolIml | undefined {
    const tsSymbol = this.getTsSymbol(node.internal);
    if (tsSymbol) {
      const symbol = this.getOrCreate(tsSymbol);
      if (symbol) this.nodeToSymbolCache.set(node, symbol);
      return symbol;
    }
    return;
  }

  private getTsSymbol(node: ts.Node): ts.Symbol | undefined {
    const symbol =
      this.getSymbolAssignToNode(node) ||
      this.tsTypeChecker.getSymbolAtLocation(node) ||
      this.getTsSymbolForNodeName(node);
    return symbol && this.skipAliasses(symbol);
  }

  private getTsSymbolForNodeName(node: ts.Node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (node as any).name && this.getTsSymbol((node as any).name);
  }

  private getFromNodeToSymbolCache(node: Node) {
    this.nodeToSymbolCache.get(node);
  }

  private getOrCreate(tsSymbol: ts.Symbol): SymbolIml {
    let symbol = this.tsSymbolToSymbolCache.get(tsSymbol);
    if (symbol) return symbol;

    symbol = new SymbolIml(this.context, tsSymbol);
    this.tsSymbolToSymbolCache.set(tsSymbol, symbol);
    return symbol;
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
