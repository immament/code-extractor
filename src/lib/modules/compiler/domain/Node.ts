import ts from 'typescript';
import {ProgramContext} from './ProgramContext';
import {SourceFile} from './SourceFile';
import {SymbolIml} from './SymbolIml';

// TODO: should have parent
export class Node {
  readonly kind: ts.SyntaxKind;
  #symbol?: SymbolIml;
  #childs: Node[] | undefined;
  #sourceFile: SourceFile;

  constructor(
    protected readonly context: ProgramContext,
    protected readonly tsNode: ts.Node
  ) {
    this.kind = tsNode.kind;
    this.#sourceFile = this.initSourceFile();
  }

  initSourceFile() {
    // console.log('initSourceFile', this.kind, this.getKindText());
    return this.kind !== ts.SyntaxKind.SourceFile
      ? this.context.getNodeOrCreate<SourceFile>(this.tsNode.getSourceFile())
      : ((this as unknown) as SourceFile);
  }

  get internal() {
    return this.tsNode;
  }

  getKindText() {
    return ts.SyntaxKind[this.kind];
  }

  getSymbol(): SymbolIml | undefined {
    return (this.#symbol ??= this.context.getTypeChecker().getSymbol(this));
  }

  getSourceFile(): SourceFile {
    return this.#sourceFile;
  }

  forEachChild(cbNode: (node: Node) => Node | undefined) {
    let result: Node | undefined;

    this.getChilds().some(node => {
      return (result = cbNode(node));
    });

    return result;
  }

  private getChilds(): Node[] {
    return (this.#childs ??= this.loadChilds());
  }

  private loadChilds() {
    const childs: Node[] = [];
    this.internal.forEachChild(child => {
      // WARNING! return value break loop
      childs.push(new Node(this.context, child));
    });
    return childs;
  }
}
