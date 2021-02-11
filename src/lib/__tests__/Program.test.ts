import {Program} from '../Program';
import {createInMemoryCompilerHost} from '@tests/utils/createInMemoryCompilerHost';
import {InMemoryCompilerHost} from '@tests/stubs/InMemoryCompilerHost';

describe('Program', () => {
  test('should create ts.Program', () => {
    const compilerHost = new InMemoryCompilerHost();
    const program = new Program({
      rootNames: [],
      options: {},
      host: compilerHost,
    });
    expect(program.tsProgram).toBeDefined();
  });

  test('should source files count be', () => {
    const files: [string, string][] = [
      ['/index.ts', 'let v = "Index"'],
      ['/file01.ts', 'let v = "Welcome1"'],
      ['/file02.ts', 'let v = "Welcome2"'],
    ];
    const compilerHost = createInMemoryCompilerHost(files);
    const program = new Program({
      rootNames: getFilesNames(files),
      options: {},
      host: compilerHost,
    });

    expect(program.tsProgram.getSourceFiles()).toHaveLength(3);
  });

  test('should contain index.ts source files', () => {
    const fileName = '/index.ts';
    const files: [string, string][] = [[fileName, 'let v = "Index"']];
    const compilerHost = createInMemoryCompilerHost(files);
    const program = new Program({
      rootNames: getFilesNames(files),
      options: {},
      host: compilerHost,
    });

    expect(program.tsProgram.getSourceFile(fileName)?.fileName).toBe(fileName);
  });

  function getFilesNames(files: [string, string][]) {
    return files.map(([name]) => name);
  }
});
