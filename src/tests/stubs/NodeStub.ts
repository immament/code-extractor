import ts from 'typescript';
import {IdGenerator} from '../utils/IdGenerator';

export interface CreateNodeArgs {
  childs?: NodeStub[];
  kind?: number;
  symbol?: ts.Symbol;
  parent?: NodeStub;
  sourceFile?: ts.SourceFile;
}

export class NodeStub {
  #symbol?: ts.Symbol;
  #parent?: NodeStub | undefined;
  private _kind: number;
  private _childs: NodeStub[] = [];
  private _id: number;
  private sourceFile?: ts.SourceFile;

  get parent(): NodeStub | undefined {
    return this.#parent;
  }
  get symbol(): ts.Symbol | undefined {
    return this.#symbol;
  }
  get kind() {
    return this._kind;
  }
  get id() {
    return this._id;
  }

  constructor(args: CreateNodeArgs) {
    const {childs = [], kind = -1, symbol, parent, sourceFile} = args;

    this._childs = childs;
    this._kind = kind;
    this.#symbol = symbol;
    this.#parent = parent;
    this.sourceFile = sourceFile ?? this.ifNodeIsSourceFileReturnsThis(kind);

    this._id = IdGenerator.next();
  }

  getChildren(): ts.Node[] {
    return ([...this._childs] as unknown[]) as ts.Node[];
  }

  forEachChild<T>(cbNode: (node: ts.Node) => T | undefined): T | undefined {
    this._childs.map(node => cbNode(node.asNode()));
    return;
  }

  getText(): string {
    return 'text-' + this._kind;
  }

  getSourceFile(): ts.SourceFile {
    if (!this.sourceFile) {
      //console.log('- NO source file', this);
      throw new Error('NodeStub have not got source file. Wrong test data?');
    }
    //console.log('+ source file', this);
    return this.sourceFile;
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

  private ifNodeIsSourceFileReturnsThis(kind: ts.SyntaxKind) {
    return kind === ts.SyntaxKind.SourceFile
      ? (this.asNode() as ts.SourceFile)
      : undefined;
  }
  // #endregion
}
