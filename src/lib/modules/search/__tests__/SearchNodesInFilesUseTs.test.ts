import {Program} from '@lib/modules/compiler/domain/Program';
import {SourceFile} from '@lib/modules/compiler/domain/SourceFile';
import {createProgram} from '@tests/utils/builders/createProgram';
import ts from 'typescript';
import {NodeSearcher} from '../NodeSearcher';

describe('SearchNodesInFilesUseTs.test', () => {
  let program: Program;
  let project: NodeSearcher;
  let sourceFile: SourceFile;

  test('should find variable declaration', () => {
    init(['/index.ts', 'let v = "Index"']);
    expect(
      project.searchInFile(sourceFile, [ts.SyntaxKind.VariableDeclaration])
    ).toHaveLength(1);
  });

  test('should find class declaration', () => {
    init([
      '/index.ts',
      `class MyClass {
    constructor() {}
}`,
    ]);
    expect(
      project.searchInFile(sourceFile, [ts.SyntaxKind.ClassDeclaration])
    ).toHaveLength(1);
  });

  test('should find 5 declarations', () => {
    init([
      '/index.ts',
      `class MyClass {}
    class MyInterface {}
    function myFunction () { return 1; }
    const myVariable1 = 11;
    const myVariable2 = 'ok';
    let myVariable3 = () => true;
    `,
    ]);

    expect(
      project.searchInFile(sourceFile, [
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
        ts.SyntaxKind.InterfaceDeclaration,
      ])
    ).toHaveLength(6);
  });

  function init(...files: [string, string][]) {
    program = createProgram(files);
    project = new NodeSearcher(program.getContext());
    sourceFile = program.getSourceFiles()[0];
  }
});
