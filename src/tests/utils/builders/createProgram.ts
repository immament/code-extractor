import {Program} from '@lib/modules/compiler/domain/Program';
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
