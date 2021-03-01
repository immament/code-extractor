import {Program} from '@lib/modules/compiler/domain/Program';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {searchNodes} from '../node-utils';
import {createInMemoryCompilerHost} from './createInMemoryCompilerHost';

export function createProgram(files: [name: string, content: string][]) {
  const compilerHost = createInMemoryCompilerHost(files);
  return new Program({
    rootNames: getFilesNames(files),
    options: {},
    host: compilerHost,
  });
}

function getFilesNames(files: [string, string][]) {
  return files.map(([name]) => name);
}

const defaultSourceFileName = '/index.ts';

export function createSourceFileInProgram(sourceFileContent: string) {
  const program = createProgram([[defaultSourceFileName, sourceFileContent]]);
  return program.getSourceFile(defaultSourceFileName)!;
}

export function nodesFromText(content: string, kinds: NodeKind[]) {
  const sourceFile = createSourceFileInProgram(content);
  return searchNodes(sourceFile, n => kinds.includes(n.kind));
}

export function declarationsFromText(content: string) {
  return nodesFromText(content, [
    NodeKind.ClassDeclaration,
    NodeKind.InterfaceDeclaration,
  ]);
}
