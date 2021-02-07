import ts from 'typescript';

export interface CreateNodeArgs {
  nodes?: ts.Node[];
  kind?: number;
  symbol?: ts.Symbol;
  parent?: NodeStub;
}

export class NodeStub {
  #symbol?: ts.Symbol;
  #parent?: NodeStub | undefined;
  #kind: number;
  #childs: NodeStub[] = [];

  get parent(): NodeStub | undefined {
    return this.#parent;
  }
  get symbol(): ts.Symbol | undefined {
    return this.#symbol;
  }
  get kind() {
    return this.#kind;
  }
  get childs() {
    return this.#childs;
  }

  constructor({nodes = [], kind = -1, symbol, parent}: CreateNodeArgs = {}) {
    this.#childs = (nodes as unknown[]) as NodeStub[];
    this.#kind = kind;
    this.#symbol = symbol;
    this.#parent = parent;
  }

  getChildCount(): number {
    return this.#childs.length;
  }

  getChildren(): ts.Node[] {
    return (this.#childs as unknown[]) as ts.Node[];
  }

  addChild(child: NodeStub) {
    this.#childs.push(child);
  }

  forEachChild<T>(cbNode: (node: ts.Node) => T | undefined): T | undefined {
    this.#childs.forEach(node => cbNode(node.asNode()));
    return;
  }

  // #region Stub helpers

  asNode(): ts.Node {
    return (this as unknown) as ts.Node;
  }

  getSymbol(): ts.Symbol | undefined {
    return this.#symbol;
  }
}
