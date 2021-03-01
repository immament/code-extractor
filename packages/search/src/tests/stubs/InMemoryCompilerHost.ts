import {EOL} from 'os';
import ts from 'typescript';

export class InMemoryCompilerHost implements ts.CompilerHost {
  #sourceFilesMap = new Map<string, ts.SourceFile>();

  constructor(private filesMap: Map<string, string>) {}

  getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget
    // onError?: (message: string) => void,
    // shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    return (
      this.#sourceFilesMap.get(fileName) ||
      this.createSourceFile(fileName, languageVersion)
    );
  }

  fileExists = (fileName: string): boolean => {
    return this.filesMap.has(fileName);
  };

  readFile = (fileName: string): string | undefined =>
    this.filesMap.get(fileName);
  getDefaultLibFileName = (options: ts.CompilerOptions): string =>
    '/' + ts.getDefaultLibFileName(options); // /lib.d.ts
  getCurrentDirectory = (): string => '/';
  getCanonicalFileName = (fileName: string): string => fileName;
  useCaseSensitiveFileNames = (): boolean => true;
  getNewLine = (): string => EOL;
  writeFile: ts.WriteFileCallback = () => {};

  private createSourceFile(fileName: string, languageVersion: ts.ScriptTarget) {
    const fileContent = this.readFile(fileName);
    if (fileContent) {
      const sourceFile = ts.createSourceFile(
        fileName,
        fileContent,
        languageVersion
      );

      this.#sourceFilesMap.set(fileName, sourceFile);
      return sourceFile;
    }
    return;
  }
}
