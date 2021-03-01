import {Node} from '@imm/ts-common/src/lib/modules/compiler/domain/Node';
import {ProgramContext} from '@imm/ts-common/src/lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@imm/ts-common/src/lib/modules/compiler/domain/SyntaxKind';
import {
  createTsNodeStub,
  createTsNodeStubWithChilds,
} from '@imm/ts-common/src/tests/utils/builders/createNodeStub';
import {Reference} from '@lib2/modules/search/model/Reference';
import ts from 'typescript';
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
