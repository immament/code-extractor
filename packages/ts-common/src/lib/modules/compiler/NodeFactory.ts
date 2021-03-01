import ts from 'typescript';
import {ClassDeclaration} from './domain/ClassDeclaration';
import {HeritageClause} from './domain/HeritageClause';
import {InterfaceDeclaration} from './domain/InterfaceDeclaration';
import {Node} from './domain/Node';
import {ProgramContext} from './domain/ProgramContext';
import {SourceFile} from './domain/SourceFile';
import {NodeKind} from './domain/SyntaxKind';

const kindToNodeMapper: Partial<Record<NodeKind, typeof Node>> = {
  [NodeKind.ClassDeclaration]: ClassDeclaration,
  [NodeKind.InterfaceDeclaration]: InterfaceDeclaration,
  [NodeKind.SourceFile]: SourceFile,
  [NodeKind.HeritageClause]: HeritageClause,
};

export class NodeFactory {
  constructor(private contex: ProgramContext) {}

  create(tsNode: ts.Node): Node {
    const ctor = kindToNodeMapper[tsNode.kind] || Node;
    return new ctor!(this.contex, tsNode);
  }
}
