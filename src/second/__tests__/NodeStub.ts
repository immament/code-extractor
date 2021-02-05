import ts from 'typescript';

interface CreateNodeArgs {
  nodes?: ts.Node[];
  kind?: number;
  symbol?: ts.Symbol;
}

export function createNode(args: CreateNodeArgs = {}) {
  return new NodeStub(args).asNode();
}

export class NodeStub {
  kind: number;

  constructor({nodes = [], kind = -1, symbol}: CreateNodeArgs = {}) {
    this.nodes = nodes;
    this.kind = kind;
    this.symbol = symbol;
  }

  forEachChild<T>(cbNode: (node: ts.Node) => T | undefined): T | undefined {
    this.nodes.forEach(node => cbNode(node));
    return;
  }

  // #region Stub helpers

  private nodes: ts.Node[];
  private symbol?: ts.Symbol;

  asNode(): ts.Node {
    return (this as unknown) as ts.Node;
  }

  getSymbol(): ts.Symbol | undefined {
    return this.symbol;
  }

  // #endregion
}
