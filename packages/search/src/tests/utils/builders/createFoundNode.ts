import {Node} from '@imm/ts-common/src/lib/modules/compiler/domain/Node';
import {Program} from '@imm/ts-common/src/lib/modules/compiler/domain/Program';
import {ProgramContext} from '@imm/ts-common/src/lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@imm/ts-common/src/lib/modules/compiler/domain/SyntaxKind';
import {createTsNodeStub} from '@imm/ts-common/src/tests/utils/builders/createNodeStub';
import {FoundNode} from '@lib2/modules/search/model/FoundNode';
import ts from 'typescript';

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
