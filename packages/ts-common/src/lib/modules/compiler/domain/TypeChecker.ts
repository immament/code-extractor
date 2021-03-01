import ts from 'typescript';
import {Cache} from '../../../common/Cache';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {SymbolIml} from './SymbolIml';

interface NodeWithSymbol extends ts.Node {
  symbol?: ts.Symbol;
}

export class TypeChecker {
  private readonly tsSymbolToSymbolCache = new Cache<ts.Symbol, SymbolIml>();
  private readonly nodeToSymbolCache = new Cache<Node, SymbolIml | undefined>();

  constructor(
    private readonly context: ProgramContext,
    private readonly tsTypeChecker: ts.TypeChecker
  ) {}

  getSymbol(node: Node): SymbolIml | undefined {
    return this.nodeToSymbolCache.getOrCreate(node, this.getSymbolLoader());
  }

  getExportsOfModule(symbol: SymbolIml): SymbolIml[] {
    return this.tsTypeChecker
      .getExportsOfModule(symbol.internal)
      .map(s => this.getOrCreateSymbol(s));
  }

  getOrCreateSymbol(tsSymbol: ts.Symbol) {
    return this.tsSymbolToSymbolCache.getOrCreate(
      tsSymbol,
      this.getSymbolImlCreator()
    );
  }

  // only dev
  get internal() {
    return this.tsTypeChecker;
  }

  private getSymbolLoader(): (node: Node) => SymbolIml | undefined {
    return node => {
      const tsSymbol = this.getTsSymbol(node.internal);
      if (tsSymbol) {
        return this.tsSymbolToSymbolCache.getOrCreate(
          tsSymbol,
          this.getSymbolImlCreator()
        );
      }
      return;
    };
  }
  private getSymbolImlCreator(): (tsSymbol: ts.Symbol) => SymbolIml {
    return tsSymbol => new SymbolIml(this.context, tsSymbol);
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
