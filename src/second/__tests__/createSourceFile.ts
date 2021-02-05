import ts from 'typescript';
import {NodeStub} from './NodeStub';

export function createSourceFile(nodes?: ts.Node[]): ts.SourceFile {
  return (new NodeStub({
    nodes,
    kind: ts.SyntaxKind.SourceFile,
  }) as unknown) as ts.SourceFile;
}
