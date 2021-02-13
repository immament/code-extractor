import ts from 'typescript';
import {Context, SourceFile} from './SourceFile';
import {TypeChecker} from './TypeChecker';

export class Program {
  readonly #tsProgram: ts.Program;
  readonly #context: Context;

  get tsProgram(): ts.Program {
    return this.#tsProgram;
  }

  #typeChecker?: TypeChecker;

  constructor(options: ts.CreateProgramOptions) {
    this.#tsProgram = this.createProgram(options);
    this.#context = new Context(this);
  }

  getContext() {
    return this.#context;
  }

  getTypeChecker() {
    return (this.#typeChecker ??= new TypeChecker(
      this.#tsProgram.getTypeChecker()
    ));
  }

  getSourceFile(fileName: string) {
    const tsSourceFile = this.#tsProgram.getSourceFile(fileName);
    if (tsSourceFile) {
      return new SourceFile(this.#context, tsSourceFile);
    }
    return;
  }

  private createProgram(options: ts.CreateProgramOptions) {
    return ts.createProgram(options);
  }
}
