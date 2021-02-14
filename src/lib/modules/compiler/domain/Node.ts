import ts from 'typescript';
import {ProgramContext} from './ProgramContext';
import {SourceFile} from './SourceFile';
import {SymbolIml} from './SymbolIml';

// TODO: should have parent
export class Node {
  readonly kind: ts.SyntaxKind;
  #symbol?: SymbolIml;
  #childs: Node[] | undefined;

  constructor(
    protected readonly context: ProgramContext,
    protected readonly tsNode: ts.Node
  ) {
    this.kind = tsNode.kind;
  }

  get internal(): ts.Node {
    return this.tsNode;
  }

  getSymbol(): SymbolIml | undefined {
    return (this.#symbol ??= this.context.getTypeChecker().getSymbol(this));
  }

  getSourceFile(): SourceFile {
    return this.context.getNodeOrCreate<SourceFile>(
      this.tsNode.getSourceFile()
    );
  }

  getKindText(): string {
    return ts.SyntaxKind[this.kind];
  }

  /** if callback returns result then loop break and returns callback result */
  forEachChild<T>(cbNode: (node: Node) => T | undefined): T | undefined {
    let result: T | undefined;
    this.getChilds().some(node => {
      return (result = cbNode(node));
    });
    return result;
  }

  private getChilds(): Node[] {
    return (this.#childs ??= this.getChildsFromTs());
  }

  private getChildsFromTs() {
    const childs: Node[] = [];
    this.internal.forEachChild(child => {
      // WARNING! returns value break ts.Node.forEachChild loop
      childs.push(this.context.getNodeOrCreate(child));
    });
    return childs;
  }
}
