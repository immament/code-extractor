import {createProgram} from '@tests/utils/builders/createProgram';
import ts from 'typescript';
import {NodeSearcher} from '../NodeSearcher';

describe('Search Nodes in Files', () => {
  let nodeSearcher: NodeSearcher;
  let sourceFiles: ts.SourceFile[];

  test('should return empty table when not find anything', () => {
    init();
    expect(nodeSearcher.searchInTsFiles(sourceFiles, [])).toHaveLength(0);
  });

  test('should find class declaration when in file ', () => {
    const searchedKinds = [ts.SyntaxKind.ClassDeclaration];
    init([
      '/index.ts',
      `class MyClass {
        constructor() {}
    }`,
    ]);
    expect(
      nodeSearcher.searchInTsFiles(sourceFiles, searchedKinds)
    ).toHaveLength(1);
  });

  test('should find 3 class declaration`s in 2 files ', () => {
    const searchedKinds = [ts.SyntaxKind.ClassDeclaration];
    init(
      ['/index.ts', 'class MyClass1 { constructor() {}}'],
      [
        '/index2.ts',
        `class MyClass2 { constructor() {}}
        class MyClass3 { }`,
      ]
    );
    expect(
      nodeSearcher.searchInTsFiles(sourceFiles, searchedKinds)
    ).toHaveLength(3);
  });

  test('should find 3 class declaration`s in 2 files ', () => {
    init(
      [
        '/index.ts',
        `class MyClass {}
      class MyInterface {}
      function myFunction () { return 1; }
      const myVariable1 = 11;
      const myVariable2 = 'ok';
      let myVariable3 = () => true;
      `,
      ],
      [
        '/index2.ts',
        `class MyClass2 {}
      class MyInterface2 {}
      function myFunction2 () { return 1; }
      const myVariable1 = 11;
      const myVariable2 = 'ok';
      let myVariable3 = () => true;
      `,
      ]
    );

    expect(
      nodeSearcher.searchInTsFiles(sourceFiles, [
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
        ts.SyntaxKind.InterfaceDeclaration,
      ])
    ).toHaveLength(12);
  });

  function init(...files: [string, string][]) {
    const program = createProgram(files);
    nodeSearcher = new NodeSearcher(program.getContext());
    sourceFiles = program.getSourceFiles().map(sf => sf.internal);
  }
});
