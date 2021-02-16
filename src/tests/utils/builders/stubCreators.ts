import {Node} from '@lib/modules/compiler/domain/Node';
import {Program} from '@lib/modules/compiler/domain/Program';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {Reference} from '@lib/modules/search/model/Reference';
import ts from 'typescript';
import {createFoundNode} from './createItem';
import {createTsNodeStub, createTsNodeStubWithChilds} from './createNodeStub';

export function createReferenceStub(context: ProgramContext) {
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

export function createProgramContextStub(program?: Program) {
  program ??= {} as Program;
  return new ProgramContext(program);
}
