import ts from 'typescript';
import {ProgramContext} from './ProgramContext';
import {SymbolIml} from './SymbolIml';

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

  get internal() {
    return this.tsNode;
  }

  getSymbol(): SymbolIml | undefined {
    return (this.#symbol ??= this.context.getTypeChecker().getSymbol(this));
  }

  forEachChild<T>(cbNode: (node: Node) => T | undefined): T | undefined {
    this.getChilds().map(node => cbNode(node));
    return;
  }

  private getChilds(): Node[] {
    return (this.#childs ??= this.loadChilds());
  }

  private loadChilds() {
    const childs: Node[] = [];
    this.internal.forEachChild(child =>
      childs.push(new Node(this.context, child))
    );
    return childs;
  }
}
