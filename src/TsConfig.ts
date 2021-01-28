import ts from 'typescript';
import {HostEnvironment} from './HostEnvironement';

export class TsConfig {
  constructor(
    private basePath: string,
    private tsConfigFileName: string,
    private host: HostEnvironment
  ) {}

  isFileExists() {
    return !!ts.findConfigFile(
      this.basePath,
      this.host.fileExists,
      this.tsConfigFileName
    );
  }
}
