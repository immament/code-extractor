import {createProgram} from '@tests/utils/builders/createProgram';

describe('Program', () => {
  test('should create ts.Program', () => {
    const program = createProgram([]);
    expect(program).toBeDefined();
  });

  test('should getTypeChecker called twice returns the same instance', () => {
    const program = createProgram([]);
    expect(program.getTypeChecker()).toBe(program.getTypeChecker());
  });

  test('should source files count be', () => {
    const files: [string, string][] = [
      ['/index.ts', 'let v = "Index"'],
      ['/file01.ts', 'let v = "Welcome1"'],
      ['/file02.ts', 'let v = "Welcome2"'],
    ];
    const program = createProgram(files);
    expect(program.getSourceFiles()).toHaveLength(3);
  });

  test('should contain index.ts source file', () => {
    const fileName = '/index.ts';
    const program = createProgram([[fileName, 'let v = "Index"']]);

    expect(program.getSourceFile(fileName)?.getFileName()).toBe(fileName);
  });
});
