import ts from 'typescript';

export class Program {
  private _tsProgram: ts.Program;
  get tsProgram(): ts.Program {
    return this._tsProgram;
  }

  constructor(options: ts.CreateProgramOptions) {
    this._tsProgram = this.createProgram(options);
  }

  private createProgram(options: ts.CreateProgramOptions) {
    return ts.createProgram(options);
  }
}
