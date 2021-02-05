import ts from 'typescript';
import {SourceFileTraverser} from '../SourceFileTraverser';
import {TsProgram} from '../TsProgram';
import {Project} from '../TsProject';

import {mocked} from '../../tests/utils/mocked';
import {mock} from 'jest-mock-extended';

let program: TsProgram;
let mockedTsProgram: jest.Mocked<ts.Program>;
let project: Project;

describe('TsProject integreded with TsSourceFile', () => {
  beforeEach(() => {
    const tsProgram = mock<ts.Program>();
    program = new TsProgram(tsProgram);
    mockedTsProgram = mocked(tsProgram);
    project = new Project(program);
  });
  test('should getProgram return mocked program', () => {
    expect(project.getProgram()).toBe(program);
  });

  test('should getTypeChecker return mocked typeChecker', () => {
    const typeChecker = {} as ts.TypeChecker;
    mockedTsProgram.getTypeChecker.mockReturnValue(typeChecker);

    expect(project.getTypeChecker()).toBeTruthy();
  });

  test('should return source files array', () => {
    expect(project.getSourceFiles()).toBeTruthy();
  });

  test('should traverse call traverser method 2 times', () => {
    mockedTsProgram.getSourceFiles.mockReturnValue([{}, {}] as ts.SourceFile[]);
    const traverser = {traverse: jest.fn()} as SourceFileTraverser;

    project.traverse(traverser);

    expect(traverser.traverse).toHaveBeenCalledTimes(2);
  });
});
