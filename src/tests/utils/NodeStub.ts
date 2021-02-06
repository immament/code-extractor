import ts from 'typescript';

export interface CreateNodeArgs {
  nodes?: ts.Node[];
  kind?: number;
  symbol?: ts.Symbol;
  parent?: NodeStub;
}

export class NodeStub {
  private _symbol?: ts.Symbol;
  get symbol(): ts.Symbol | undefined {
    return this._symbol;
  }
  private _parent?: NodeStub | undefined;
  get parent(): NodeStub | undefined {
    return this._parent;
  }
  private _kind: number;
  get kind() {
    return this._kind;
  }
  private _childs: NodeStub[] = [];
  get childs() {
    return this._childs;
  }

  constructor({nodes = [], kind = -1, symbol, parent}: CreateNodeArgs = {}) {
    this._childs = (nodes as unknown) as NodeStub[];
    this._kind = kind;
    this._symbol = symbol;
    this._parent = parent;
  }

  getChildCount(): number {
    return this._childs.length;
  }

  getChildren(): ts.Node[] {
    return (this._childs as unknown[]) as ts.Node[];
  }

  addChild(child: NodeStub) {
    this._childs.push(child);
  }

  forEachChild<T>(cbNode: (node: ts.Node) => T | undefined): T | undefined {
    this._childs.forEach(node => cbNode(node.asNode()));
    return;
  }

  // #region Stub helpers

  asNode(): ts.Node {
    return (this as unknown) as ts.Node;
  }

  getSymbol(): ts.Symbol | undefined {
    return this._symbol;
  }
}
