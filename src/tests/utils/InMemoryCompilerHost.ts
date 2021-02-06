import ts from 'typescript';

export class InMemoryCompilerHost implements ts.CompilerHost {
  private sourceFilesMap = new Map<string, ts.SourceFile>();

  constructor(
    private filesMap: Map<string, string> = new Map<string, string>()
  ) {}

  getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget
    // onError?: (message: string) => void,
    // shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    return (
      this.sourceFilesMap.get(fileName) ||
      this.createSourceFile(fileName, languageVersion)
    );
  }

  fileExists(fileName: string): boolean {
    return this.filesMap.has(fileName);
  }
  readFile(fileName: string): string | undefined {
    return this.filesMap.get(fileName);
  }

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return '/' + ts.getDefaultLibFileName(options); // /lib.d.ts
  }

  getCurrentDirectory(): string {
    return '/';
  }
  getCanonicalFileName(fileName: string): string {
    return fileName;
  }
  useCaseSensitiveFileNames(): boolean {
    return true;
  }
  getNewLine(): string {
    return '\n';
  }

  writeFile: ts.WriteFileCallback = () => {
    throw new Error('Method not implemented.');
  };

  private createSourceFile(fileName: string, languageVersion: ts.ScriptTarget) {
    const fileContent = this.readFile(fileName);
    if (fileContent) {
      const sourceFile = ts.createSourceFile(
        fileName,
        fileContent,
        languageVersion
      );

      this.sourceFilesMap.set(fileName, sourceFile);
      return sourceFile;
    }
    return;
  }
}
