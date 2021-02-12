import ts from 'typescript';
import {InMemoryCompilerHost} from '../InMemoryCompilerHost';

describe('InMemoryCompilerHost', () => {
  let filesMap: Map<string, string>;
  let compilerHost: ts.CompilerHost;

  describe('Test file`s methods', () => {
    beforeEach(() => {
      filesMap = new Map<string, string>();
      compilerHost = new InMemoryCompilerHost(filesMap);
    });

    test('should not find file ', () => {
      expect(
        compilerHost.getSourceFile('fileNotExists.ts', ts.ScriptTarget.ES2020)
      ).toBeUndefined();
    });

    test('should get source file ', () => {
      filesMap.set('index.ts', 'let v = "Welcome"');
      expect(
        compilerHost.getSourceFile('index.ts', ts.ScriptTarget.ES2020)
      ).toBeDefined();
    });

    test('should source file contain text', () => {
      filesMap.set('index.ts', 'let v = "Welcome"');
      const sourceFile = compilerHost.getSourceFile(
        'index.ts',
        ts.ScriptTarget.ES2020
      );
      expect(sourceFile?.getText()).toContain('Welcome');
    });

    test('should cache source file', () => {
      filesMap.set('index.ts', 'let v = "Welcome"');
      const oldSourceFile = compilerHost.getSourceFile(
        'index.ts',
        ts.ScriptTarget.ES2020
      );
      expect(
        compilerHost.getSourceFile('index.ts', ts.ScriptTarget.ES2020)
      ).toBe(oldSourceFile);
    });

    test('should file exists', () => {
      filesMap.set('index.ts', 'let v = "Welcome"');
      const compilerHost = new InMemoryCompilerHost(filesMap);
      expect(compilerHost.fileExists('index.ts')).toBeTruthy();
    });

    test('should file not exists', () => {
      filesMap.set('index.ts', 'let v = "Welcome"');
      const compilerHost = new InMemoryCompilerHost(filesMap);
      expect(compilerHost.fileExists('file.ts')).toBeFalsy();
    });

    test('should read file content', () => {
      const fileContent = 'let v = "Welcome"';
      filesMap.set('index.ts', fileContent);
      const compilerHost = new InMemoryCompilerHost(filesMap);
      expect(compilerHost.readFile('index.ts')).toEqual(fileContent);
    });

    test('should read file return undefined if file not exists', () => {
      const fileContent = 'let v = "Welcome"';
      filesMap.set('index.ts', fileContent);
      const compilerHost = new InMemoryCompilerHost(filesMap);
      expect(compilerHost.readFile('file.ts')).toBeUndefined();
    });
  });

  describe('Test simple methods', () => {
    beforeAll(() => {
      filesMap = new Map<string, string>();
      compilerHost = new InMemoryCompilerHost(filesMap);
    });
    test('should get default lib file name', () => {
      expect(compilerHost.getDefaultLibFileName({})).toEqual('/lib.d.ts');
    });

    test('should current directory be root', () => {
      expect(compilerHost.getCurrentDirectory()).toEqual('/');
    });

    test('should CanonicalFileName be equal file name', () => {
      const fileName = 'index.ts';
      expect(compilerHost.getCanonicalFileName(fileName)).toEqual(fileName);
    });

    test('should useCaseSensitiveFileNames be true', () => {
      expect(compilerHost.useCaseSensitiveFileNames()).toBeTruthy();
    });

    test('should new line be "\n"', () => {
      expect(compilerHost.getNewLine()).toBeTruthy();
    });
  });
});
