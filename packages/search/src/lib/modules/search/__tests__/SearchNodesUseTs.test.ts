import {Program} from '@lib/modules/compiler/domain/Program';
import {SourceFile} from '@lib/modules/compiler/domain/SourceFile';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {createProgram} from 'src/tests-common/utils/builders/createProgram';
import {NodeSearcher} from '../NodeSearcher';

describe('SearchNodeUseTs', () => {
  let program: Program;
  let project: NodeSearcher;
  let sourceFile: SourceFile;

  test('should find variable declaration', () => {
    init(['/index.ts', 'let v = "Index"']);

    expect(
      project.searchInFile(sourceFile, [NodeKind.VariableDeclaration])
    ).toHaveLength(1);
  });

  test('should find class declaration', () => {
    init(['/index.ts', 'class MyClass {constructor() {}}']);
    expect(
      project.searchInFile(sourceFile, [NodeKind.ClassDeclaration])
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
        NodeKind.VariableDeclaration,
        NodeKind.ClassDeclaration,
        NodeKind.FunctionDeclaration,
        NodeKind.InterfaceDeclaration,
      ])
    ).toHaveLength(6);
  });

  function init(...files: [string, string][]) {
    program = createProgram(files);
    project = new NodeSearcher(program.getContext());
    sourceFile = program.getSourceFiles()[0];
  }
});
