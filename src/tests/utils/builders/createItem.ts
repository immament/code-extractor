import {Node} from '@lib/modules/compiler/domain/Node';
import {Program} from '@lib/modules/compiler/domain/Program';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {FoundNode} from '@lib/modules/search/model/FoundNode';
import ts from 'typescript';
import {createTsNodeStub} from './createNodeStub';

export function createFoundNode(
  context?: ProgramContext,
  sourceFile?: ts.SourceFile
) {
  return new FoundNode(
    new Node(
      context ?? new ProgramContext({} as Program),
      createTsNodeStub({sourceFile}).asNode()
    )
  );
}
