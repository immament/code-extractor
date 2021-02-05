import ts from 'typescript';
import {HostEnvironment} from './HostEnvironement';

export class TsConfig {
  constructor(
    private basePath: string,
    private tsConfigFileName: string,
    private host: HostEnvironment
  ) {}

  isFileExists(): boolean {
    return !!this.getFullPath();
  }

  getFullPath(): string | undefined {
    return ts.findConfigFile(
      this.basePath,
      this.host.fileExists,
      this.tsConfigFileName
    );
  }

  getCompilerOptions(): ts.CompilerOptions {
    const {config} = this.readConfigFile();
    const compilerOptions = ts.parseJsonConfigFileContent(
      config,
      this.host,
      this.basePath
    );

    return compilerOptions.options;
  }

  readConfigFile(): Record<string, unknown> {
    const fullPath = this.getFullPath();
    if (!fullPath) {
      const errMsg = `Can't find ts-config file: '${this.tsConfigFileName}', baseDir: '${this.basePath}'`;
      throw new TsConfigError(errMsg);
    }
    const result = ts.readConfigFile(fullPath, this.host.readFile);
    if (result.error) {
      throw new TsConfigError(
        `Read config error: ${result.error.messageText} [code: ${result.error.code}]`
      );
    }
    return result.config;
  }
}

export interface Diagnostic {
  category: string;
  code: number;
  fileName?: string;
}
export class TsConfigError extends Error {
  diagnostic?: Diagnostic;
  constructor(message?: string, diagnosticError?: ts.Diagnostic) {
    super(message);

    if (diagnosticError) {
      this.fillDiagtostic(diagnosticError);
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }

  private fillDiagtostic(diagnosticError: ts.Diagnostic) {
    this.diagnostic = {
      category: ts.DiagnosticCategory[diagnosticError.category],
      code: diagnosticError.code,
      fileName: diagnosticError.file?.fileName,
    };
  }
}
