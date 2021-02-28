import ts from 'typescript';
import {HeritageClauseable} from './HeritageClauseable';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {NodeKind} from './SyntaxKind';

export class InterfaceDeclaration extends HeritageClauseable {
  constructor(
    context: ProgramContext,
    protected tsNode: ts.InterfaceDeclaration
  ) {
    super(context, tsNode);
  }

  getMembers() {
    return this.tsNode.members.map(m => this.context.getNodeOrCreate(m));
  }

  getExtends() {
    return this.getExtendType()?.getSymbol()?.getDeclarations()[0];
  }
}

export function isInterfaceDeclaration(
  node: Node
): node is InterfaceDeclaration {
  return node.kind === NodeKind.InterfaceDeclaration;
}
