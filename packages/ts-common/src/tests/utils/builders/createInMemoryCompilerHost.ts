import {InMemoryCompilerHost} from '../../stubs/InMemoryCompilerHost';

export type InMemoryFile = [name: string, content: string];

export function createInMemoryCompilerHost(files: InMemoryFile[]) {
  if (files.some(([name]) => !name.startsWith('/'))) {
    throw new Error('Every file name have to starts with "/"');
  }
  const filesMap = new Map<string, string>(files);
  return new InMemoryCompilerHost(filesMap);
}
