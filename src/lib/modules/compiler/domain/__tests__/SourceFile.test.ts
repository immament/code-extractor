import {createProgram} from '@tests/utils/builders/createProgram';

describe('SourceFile', () => {
  test('should getSymbol when source file have exports', () => {
    const program = createProgram([['/index.ts', 'export const v = 1']]);
    const sourceFile = program.getSourceFile('/index.ts')!;
    expect(sourceFile).toBeDefined();
    expect(sourceFile.getSymbol()).toBeDefined();
  });

  test('should getSymbol rerturns undefined when source file have not exports', () => {
    const program = createProgram([['/index.ts', 'const v = 1']]);
    const sourceFile = program.getSourceFile('/index.ts')!;
    expect(sourceFile).toBeDefined();
    expect(sourceFile.getSymbol()).toBeUndefined();
  });

  test('should getExports', () => {
    const program = createProgram([['/index.ts', 'export const v = 1']]);
    const sourceFile = program.getSourceFile('/index.ts')!;

    expect(sourceFile.getExports()).toHaveLength(1);
  });

  test('should getxportDeclarations', () => {
    const program = createProgram([['/index.ts', 'export const v = 1']]);
    const sourceFile = program.getSourceFile('/index.ts')!;

    expect(sourceFile.getExportsDeclarations()).toHaveLength(1);
  });
});
