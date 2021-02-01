import ts from 'typescript';
import {Program} from './Program';
import {TsSourceFile} from './TsSourceFile';
import {TypeChecker} from './TypeChecker';

export class TsProgram implements Program {
  private typeChecker: TypeChecker;
  constructor(private tsProgram: ts.Program) {
    this.typeChecker = new TypeChecker(tsProgram.getTypeChecker());
  }

  getTypeChecker(): TypeChecker {
    return this.typeChecker;
  }

  getSourceFiles(): TsSourceFile[] {
    return this.tsProgram.getSourceFiles().map(() => new TsSourceFile());
  }
}
