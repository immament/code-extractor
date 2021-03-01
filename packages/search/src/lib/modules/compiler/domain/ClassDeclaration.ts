import ts from 'typescript';
import {Declaration} from './Declaration';
import {HeritageClauseable} from './HeritageClauseable';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {NodeKind} from './SyntaxKind';
import {Type} from './Type';

export class ClassDeclaration extends HeritageClauseable {
  constructor(context: ProgramContext, protected tsNode: ts.ClassDeclaration) {
    super(context, tsNode);
  }

  getImplements(): Node[] {
    const types = this.getImpelementTypes();

    return types
      .map(t => t.getSymbol()?.getDeclarations()?.[0])
      .filter(d => !!d) as Declaration[];
  }

  getBaseClass(): Node | undefined {
    return this.getExtendType()?.getSymbol()?.getDeclarations()[0];
  }

  getMembers() {
    return this.tsNode.members.map(m => this.context.getNodeOrCreate(m));
  }

  protected getImpelementTypes(): Type[] {
    return (
      this.getHeritageClause(NodeKind.ImplementsKeyword)?.getHeritageTypes() ??
      []
    );
  }
}

export function isClassDeclaration(node: Node): node is ClassDeclaration {
  return node.kind === NodeKind.ClassDeclaration;
}
