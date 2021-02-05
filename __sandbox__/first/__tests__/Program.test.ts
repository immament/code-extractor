import {mock, MockProxy} from 'jest-mock-extended';
import ts from 'typescript';

import {TsProgram} from '../TsProgram';

let tsProgram: MockProxy<ts.Program>;
let program: TsProgram;

describe('Program', () => {
  beforeEach(() => {
    tsProgram = mock<ts.Program>();
    program = new TsProgram(tsProgram);
  });
  test('should return TypeChecker', () => {
    expect(program.getTypeChecker()).toBeTruthy();
  });

  test('should getSourceFiles return 0 source files ', () => {
    tsProgram.getSourceFiles.mockReturnValue([]);
    expect(program.getSourceFiles().length).toBe(0);
  });

  test('should getSourceFiles return 3 source files ', () => {
    tsProgram = mock<ts.Program>();

    tsProgram.getSourceFiles.mockReturnValue([
      {} as ts.SourceFile,
      {} as ts.SourceFile,
      {} as ts.SourceFile,
    ]);
    program = new TsProgram(tsProgram);
    expect(program.getSourceFiles().length).toBe(3);
  });
});
