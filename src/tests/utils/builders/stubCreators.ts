import {Node} from '@lib/modules/compiler/domain/Node';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {Reference} from '@lib/modules/search/model/Reference';
import ts from 'typescript';
import {createFoundNode} from './createItem';
import {createTsNodeStub, createTsNodeStubWithChilds} from './createNodeStub';

export function createReference(context: ProgramContext) {
  const sourceFile = createTsNodeStub({
    kind: ts.SyntaxKind.SourceFile,
  }).asNode() as ts.SourceFile;

  const nodeForFromItem = createTsNodeStubWithChilds(sourceFile);
  const nodeFrom = new Node(context, nodeForFromItem.asNode());
  const reference = new Reference(
    createFoundNode(context, nodeFrom),
    createFoundNode(context)
  );
  reference.fromNode = nodeFrom.forEachChild(n => n);
  return reference;
}
