import ts from 'typescript';

export interface CreateNodeArgs {
  childs?: NodeStub[];
  kind?: number;
  symbol?: ts.Symbol;
  parent?: NodeStub;
}

export class NodeStub {
  #symbol?: ts.Symbol;
  #parent?: NodeStub | undefined;
  private _kind: number;
  private _childs: NodeStub[] = [];

  get parent(): NodeStub | undefined {
    return this.#parent;
  }
  get symbol(): ts.Symbol | undefined {
    return this.#symbol;
  }
  get kind() {
    return this._kind;
  }

  constructor({childs = [], kind = -1, symbol, parent}: CreateNodeArgs) {
    this._childs = childs;
    this._kind = kind;
    this.#symbol = symbol;
    this.#parent = parent;
  }

  getChildren(): ts.Node[] {
    return ([...this._childs] as unknown[]) as ts.Node[];
  }

  forEachChild<T>(cbNode: (node: ts.Node) => T | undefined): T | undefined {
    this._childs.map(node => cbNode(node.asNode()));
    return;
  }

  // #region Stub helpers
  getChildCount(): number {
    return this._childs.length;
  }

  getChild(index: number) {
    return this._childs[index];
  }

  addChild(child: NodeStub) {
    this._childs.push(child);
  }

  asNode(): ts.Node {
    return (this as unknown) as ts.Node;
  }

  getSymbol(): ts.Symbol | undefined {
    return this.#symbol;
  }
}
