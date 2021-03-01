import {Node} from '@lib/modules/compiler/domain/Node';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {Reference} from '@lib/modules/search/model/Reference';
import ts from 'typescript';
import {
  createTsNodeStub,
  createTsNodeStubWithChilds,
} from '../../../tests-common/utils/builders/createNodeStub';
import {createFoundNode, createFoundNodeWithNode} from './createFoundNode';

export function createReferenceStub(context: ProgramContext) {
  const sourceFile = createTsNodeStub({
    kind: NodeKind.SourceFile,
  }).asNode() as ts.SourceFile;

  const nodeForFromItem = createTsNodeStubWithChilds(sourceFile);
  const nodeFrom = new Node(context, nodeForFromItem.asNode());
  const reference = new Reference(
    createFoundNodeWithNode(nodeFrom),
    createFoundNode({context}),
    'Use'
  );
  reference.fromNode = nodeFrom.forEachChild(n => n);
  return reference;
}
