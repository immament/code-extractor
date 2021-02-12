import {createSourceFile} from '@tests/utils/builders/createSourceFile';
import ts from 'typescript';
import {Project} from '../Project';

describe('Search Nodes in Files', () => {
  let project: Project;
  beforeEach(() => {
    project = new Project();
  });
  test('should return empty table when not find anything', () => {
    const sourceFiles: ts.SourceFile[] = [];
    expect(project.searchInFiles(sourceFiles, [])).toHaveLength(0);
  });

  test('should find class declaration when in file ', () => {
    const searchedKinds = [ts.SyntaxKind.ClassDeclaration];
    const sourceFiles: ts.SourceFile[] = [
      createSourceFile(
        'index.ts',
        `class MyClass {
        constructor() {}
    }`
      ),
    ];
    expect(project.searchInFiles(sourceFiles, searchedKinds)).toHaveLength(1);
  });

  test('should find 3 class declaration`s in 2 files ', () => {
    const searchedKinds = [ts.SyntaxKind.ClassDeclaration];
    const sourceFiles: ts.SourceFile[] = [
      createSourceFile(
        'index.ts',
        `class MyClass1 {
          constructor() {}
        }`
      ),

      createSourceFile(
        'index2.ts',
        `class MyClass2 {
          constructor() {}
      }
      
      class MyClass3 { }`
      ),
    ];
    expect(project.searchInFiles(sourceFiles, searchedKinds)).toHaveLength(3);
  });

  test('should find 3 class declaration`s in 2 files ', () => {
    const project = new Project();
    const sourceFiles = [
      createSourceFile(
        'index.ts',
        `class MyClass {}
      class MyInterface {}
      function myFunction () { return 1; }
      const myVariable1 = 11;
      const myVariable2 = 'ok';
      let myVariable3 = () => true;
      `
      ),
      createSourceFile(
        'index2.ts',
        `class MyClass2 {}
      class MyInterface2 {}
      function myFunction2 () { return 1; }
      const myVariable1 = 11;
      const myVariable2 = 'ok';
      let myVariable3 = () => true;
      `
      ),
    ];

    expect(
      project.searchInFiles(sourceFiles, [
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
        ts.SyntaxKind.InterfaceDeclaration,
      ])
    ).toHaveLength(12);
  });
});
