import {InMemoryCompilerHost} from '../stubs/InMemoryCompilerHost';

export function createInMemoryCompilerHost(
  files: [name: string, content: string][]
) {
  if (files.some(([name]) => !name.startsWith('/'))) {
    throw new Error('Every file name have to starts with "/"');
  }
  const filesMap = new Map<string, string>(files);
  return new InMemoryCompilerHost(filesMap);
}
