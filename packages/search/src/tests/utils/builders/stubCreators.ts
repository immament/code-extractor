import {Node} from '@lib/modules/compiler/domain/Node';
import {Program} from '@lib/modules/compiler/domain/Program';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {Reference} from '@lib/modules/search/model/Reference';
import ts from 'typescript';
import {createFoundNode, createFoundNodeWithNode} from './createFoundNode';
import {createTsNodeStub, createTsNodeStubWithChilds} from './createNodeStub';

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

export function createProgramContextStub(program?: Program) {
  program ??= {} as Program;
  return new ProgramContext(program);
}