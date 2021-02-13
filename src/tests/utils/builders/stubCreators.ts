import {Node} from '@lib/modules/compiler/domain/Node';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {FoundNode} from '@lib/modules/search/model/FoundNode';
import {Reference} from '@lib/modules/search/model/Reference';
import ts from 'typescript';
import {createFoundNode} from './createItem';
import {createTsNodeStub, createTsNodeStubWithChilds} from './createNodeStub';

export function createReference(context: ProgramContext) {
  const sourceFile = createTsNodeStub({
    kind: ts.SyntaxKind.SourceFile,
  }).asNode() as ts.SourceFile;

  const nodeForFromItem = createTsNodeStubWithChilds(sourceFile);
  const reference = new Reference(
    new FoundNode(new Node(context, nodeForFromItem.asNode())),
    createFoundNode(context)
  );
  reference.fromNode = nodeForFromItem.getChild(0).asNode();
  return reference;
}
