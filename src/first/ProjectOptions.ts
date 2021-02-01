import {HostEnvironment} from './HostEnvironement';
import {CompilerOptions} from './TsCompilerOptions';

export interface ProjectOptions {
  compilerOptions: CompilerOptions;
  host?: HostEnvironment;
}
