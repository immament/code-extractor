import ts from 'typescript';
import {ProgramContext} from './ProgramContext';
import {SourceFile} from './SourceFile';
import {TypeChecker} from './TypeChecker';

export type CreateProgramOptions = ts.CreateProgramOptions;

export class Program {
  readonly #tsProgram: ts.Program;
  readonly #context: ProgramContext;
  readonly #typeChecker: TypeChecker;

  constructor(options: CreateProgramOptions) {
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

  getSourceFile(fileName: string): SourceFile | undefined {
    const tsSourceFile = this.#tsProgram.getSourceFile(fileName);

    return (
      tsSourceFile && this.#context.getNodeOrCreate<SourceFile>(tsSourceFile)
    );
  }

  getSourceFiles(): SourceFile[] {
    return this.#tsProgram
      .getSourceFiles()
      .map(sf => this.#context.getNodeOrCreate(sf));
  }
}
