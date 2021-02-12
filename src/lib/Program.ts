import ts from 'typescript';
import {TypeChecker} from './TypeChecker';

export class Program {
  #tsProgram: ts.Program;
  get tsProgram(): ts.Program {
    return this.#tsProgram;
  }

  #typeChecker?: TypeChecker;

  constructor(options: ts.CreateProgramOptions) {
    this.#tsProgram = this.createProgram(options);
  }

  getTypeChecker() {
    return (this.#typeChecker ??= new TypeChecker(
      this.#tsProgram.getTypeChecker()
    ));
  }

  private createProgram(options: ts.CreateProgramOptions) {
    return ts.createProgram(options);
  }
}
