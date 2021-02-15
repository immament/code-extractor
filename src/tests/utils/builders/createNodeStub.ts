import {CreateNodeArgs, NodeStub} from '@tests/stubs/NodeStub';
import ts from 'typescript';

const deafultNodeKind = ts.SyntaxKind.VariableStatement;

export function createTsNodeStub({kind, sourceFile, ...args}: CreateNodeArgs) {
  if (kind !== ts.SyntaxKind.SourceFile) {
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
    kind: ts.SyntaxKind.SourceFile,
  });
}

export function createTsNodeStubWithChilds(sourceFile?: ts.SourceFile) {
  return new NodeStub({
    kind: ts.SyntaxKind.ClassDeclaration,
    childs: [
      new NodeStub({kind: ts.SyntaxKind.Identifier, sourceFile}),
      new NodeStub({kind: ts.SyntaxKind.MethodDeclaration, sourceFile}),
    ],
    sourceFile,
  });
}
