import ts from 'typescript';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {NodeKind} from './SyntaxKind';

export class HeritageClause extends Node {
  get token(): NodeKind.ExtendsKeyword | NodeKind.ImplementsKeyword {
    return this.tsNode.token;
  }

  constructor(context: ProgramContext, protected tsNode: ts.HeritageClause) {
    super(context, tsNode);
  }

  getHeritageTypes() {
    return this.tsNode.types.map(t =>
      this.context.getNodeOrCreate(t).getType()
    );
  }
}
