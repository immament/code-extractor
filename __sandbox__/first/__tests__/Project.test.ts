import ts from 'typescript';
import {TsSourceFile} from '../TsSourceFile';
import {SourceFileTraverser} from '../SourceFileTraverser';
import {TsProgram} from '../TsProgram';
import {Project} from '../TsProject';
import {TypeChecker} from '../TypeChecker';
import {mocked} from '../../tests/utils/mocked';

jest.mock('../TsProgram');

let program: TsProgram;
let mockedProgram: jest.Mocked<TsProgram>;
let project: Project;

describe('TsProject', () => {
  beforeEach(() => {
    program = new TsProgram({} as ts.Program);
    mockedProgram = mocked(program);
    project = new Project(program);
  });
  test('should getProgram return mocked program', () => {
    expect(project.getProgram()).toBe(program);
  });

  test('should getTypeChecker return mocked typeChecker', () => {
    const typeChecker = {} as TypeChecker;
    mocked(program).getTypeChecker.mockReturnValue(typeChecker);

    expect(project.getTypeChecker()).toBe(typeChecker);
  });

  test('should return source files array', () => {
    expect(project.getSourceFiles()).toBeTruthy();
  });

  test('should traverse call traverser method 2 times', () => {
    mockedProgram.getSourceFiles.mockReturnValue([
      new TsSourceFile(),
      new TsSourceFile(),
    ]);
    const traverser = {traverse: jest.fn()} as SourceFileTraverser;

    project.traverse(traverser);

    expect(traverser.traverse).toHaveBeenCalledTimes(2);
  });

  test('should traverse call traverser method with mocked source files ', () => {
    const sourceFiles = [new TsSourceFile(), new TsSourceFile()];
    mockedProgram.getSourceFiles.mockReturnValue(sourceFiles);
    const mockedTraverseMethod = jest.fn();
    const traverser = {traverse: mockedTraverseMethod};

    project.traverse(traverser);

    expect(mockedTraverseMethod.mock.calls).toEqual(
      sourceFiles.map(sf => [sf])
    );
  });
});
