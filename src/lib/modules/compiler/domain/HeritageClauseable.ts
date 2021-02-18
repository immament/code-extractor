import ts from 'typescript';
import {HeritageClause} from './HeritageClause';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {NodeKind} from './SyntaxKind';
import {Type} from './Type';

export class HeritageClauseable extends Node {
  constructor(
    context: ProgramContext,
    protected tsNode: ts.Node & {
      readonly heritageClauses?: ts.NodeArray<ts.HeritageClause>;
    }
  ) {
    super(context, tsNode);
  }

  getExtended(): Node | undefined {
    return this.getExtendType()?.getSymbol()?.getDeclarations()[0];
  }

  protected getHeritageClauses() {
    return (
      this.tsNode.heritageClauses?.map(
        hc => this.context.getNodeOrCreate(hc) as HeritageClause
      ) ?? []
    );
  }

  protected getHeritageClause(
    kind: NodeKind.ExtendsKeyword | NodeKind.ImplementsKeyword
  ) {
    return this.getHeritageClauses().find(hc => hc.token === kind);
  }

  protected getExtendType(): Type | undefined {
    return this.getHeritageClause(
      NodeKind.ExtendsKeyword
    )?.getHeritageTypes()[0];
  }
}
