import {TsSourceFile} from './TsSourceFile';
import {SourceFileTraverser} from './SourceFileTraverser';
import {TsProgram} from './TsProgram';
import {TypeChecker} from './TypeChecker';

export class Project {
  constructor(private program: TsProgram) {}

  getProgram(): TsProgram {
    return this.program;
  }

  getTypeChecker(): TypeChecker {
    return this.program.getTypeChecker();
  }

  getSourceFiles(): TsSourceFile[] {
    return [];
  }

  traverse(traverser: SourceFileTraverser): void {
    this.program.getSourceFiles().forEach(sf => traverser.traverse(sf));
  }
}
