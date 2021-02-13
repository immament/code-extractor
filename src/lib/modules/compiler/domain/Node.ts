import ts from 'typescript';
import {ProgramContext} from './ProgramContext';
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

  get internal() {
    return this.tsNode;
  }

  getSymbol(): SymbolIml | undefined {
    return (this.#symbol ??= this.context.getTypeChecker().getSymbol(this));
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
