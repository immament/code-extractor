import {CreateNodeArgs, NodeStub} from '@tests/stubs/NodeStub';
import ts from 'typescript';

export function createTsNodeStub({kind, sourceFile, ...args}: CreateNodeArgs) {
  if (kind !== ts.SyntaxKind.SourceFile) {
    sourceFile ??= createTsNodeStub({
      kind: ts.SyntaxKind.SourceFile,
    }).asNode() as ts.SourceFile;
  }
  return new NodeStub({
    kind: kind ?? ts.SyntaxKind.VariableStatement,
    sourceFile,
    ...args,
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
