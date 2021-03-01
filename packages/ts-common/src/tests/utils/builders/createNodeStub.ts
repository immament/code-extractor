import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {CreateNodeArgs, NodeStub} from '@tests/stubs/NodeStub';
import ts from 'typescript';

const deafultNodeKind = NodeKind.VariableStatement;

export function createTsNodeStub({kind, sourceFile, ...args}: CreateNodeArgs) {
  if (kind !== NodeKind.SourceFile) {
    sourceFile ??= createTsSourceFileStub().asNode() as ts.SourceFile;
  }

  return new NodeStub({
    kind: kind ?? deafultNodeKind,
    sourceFile,
    ...args,
  });
}

function createTsSourceFileStub(args: CreateNodeArgs = {}) {
  return createTsNodeStub({
    ...args,
    kind: NodeKind.SourceFile,
  });
}

export function createTsNodeStubWithChilds(sourceFile?: ts.SourceFile) {
  return new NodeStub({
    kind: NodeKind.ClassDeclaration,
    childs: [
      new NodeStub({kind: NodeKind.Identifier, sourceFile}),
      new NodeStub({kind: NodeKind.MethodDeclaration, sourceFile}),
    ],
    sourceFile,
  });
}
