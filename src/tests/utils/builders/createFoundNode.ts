import {Node} from '@lib/modules/compiler/domain/Node';
import {Program} from '@lib/modules/compiler/domain/Program';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {FoundNode} from '@lib/modules/search/model/FoundNode';
import ts from 'typescript';
import {createTsNodeStub} from './createNodeStub';

export function createFoundNodeWithNode(node: Node) {
  return new FoundNode(node);
}

export function createFoundNode({
  context,
  kind,
  sourceFile,
}: {
  context?: ProgramContext;
  sourceFile?: ts.SourceFile;
  kind?: NodeKind;
} = {}) {
  const node = new Node(
    context ?? new ProgramContext({} as Program),
    createTsNodeStub({sourceFile, kind}).asNode()
  );
  return new FoundNode(node);
}
