import ts from 'typescript';

export class Program {
  #tsProgram: ts.Program;
  get tsProgram(): ts.Program {
    return this.#tsProgram;
  }

  constructor(options: ts.CreateProgramOptions) {
    this.#tsProgram = this.createProgram(options);
  }

  private createProgram(options: ts.CreateProgramOptions) {
    return ts.createProgram(options);
  }
}
