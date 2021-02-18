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

  protected getImpelementTypes(): Type[] {
    return (
      this.getHeritageClause(NodeKind.ImplementsKeyword)?.getHeritageTypes() ??
      []
    );
  }
}
