import {CreateNodeArgs, NodeStub} from '@tests/stubs/NodeStub';
import ts from 'typescript';

export function createNodeStub(args: CreateNodeArgs) {
  args = {kind: ts.SyntaxKind.VariableStatement, ...args};
  return new NodeStub(args);
}

export function createNodeStubWithChilds() {
  return new NodeStub({
    kind: ts.SyntaxKind.ClassDeclaration,
    childs: [
      new NodeStub({kind: ts.SyntaxKind.Identifier}),
      new NodeStub({kind: ts.SyntaxKind.MethodDeclaration}),
    ],
  });
}
