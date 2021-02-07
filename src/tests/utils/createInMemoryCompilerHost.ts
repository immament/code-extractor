import {InMemoryCompilerHost} from '../stubs/InMemoryCompilerHost';

export function createInMemoryCompilerHost(files: [string, string][]) {
  const filesMap = new Map<string, string>(files);
  return new InMemoryCompilerHost(filesMap);
}
