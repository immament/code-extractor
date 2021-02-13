import ts from 'typescript';
import {SourceFile} from './SourceFile';
import {ProgramContext} from './ProgramContext';
import {TypeChecker} from './TypeChecker';

export class Program {
  readonly #tsProgram: ts.Program;
  readonly #context: ProgramContext;
  readonly #typeChecker: TypeChecker;

  constructor(options: ts.CreateProgramOptions) {
    this.#tsProgram = ts.createProgram(options);
    this.#context = new ProgramContext(this);
    this.#typeChecker = new TypeChecker(
      this.#context,
      this.#tsProgram.getTypeChecker()
    );
  }

  getContext(): ProgramContext {
    return this.#context;
  }

  getTypeChecker(): TypeChecker {
    return this.#typeChecker;
  }

  // TODO: use cache
  getSourceFile(fileName: string): SourceFile | undefined {
    const tsSourceFile = this.#tsProgram.getSourceFile(fileName);
    if (tsSourceFile) {
      return new SourceFile(this.#context, tsSourceFile);
    }
    return;
  }
  // TODO: use cache
  getSourceFiles(): SourceFile[] {
    return this.#tsProgram
      .getSourceFiles()
      .map(sf => new SourceFile(this.#context, sf));
  }
}
