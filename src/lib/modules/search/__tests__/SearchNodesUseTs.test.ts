import ts from 'typescript';
import {NodeSearcher} from '../NodeSearcher';
import {createSourceFile} from '@tests/utils/builders/createSourceFile';

test('should find variable declaration', () => {
  const project = new NodeSearcher();
  const sourceFile = createSourceFile('index.ts', 'let v = "Index"');
  expect(
    project.searchInFile(sourceFile, [ts.SyntaxKind.VariableDeclaration])
  ).toHaveLength(1);
});

test('should find class declaration', () => {
  const project = new NodeSearcher();
  const sourceFile = createSourceFile(
    'index.ts',
    `class MyClass {
    constructor() {}
}`
  );
  expect(
    project.searchInFile(sourceFile, [ts.SyntaxKind.ClassDeclaration])
  ).toHaveLength(1);
});

test('should find 5 declarations', () => {
  const project = new NodeSearcher();
  const sourceFile = createSourceFile(
    'index.ts',
    `class MyClass {}
    class MyInterface {}
    function myFunction () { return 1; }
    const myVariable1 = 11;
    const myVariable2 = 'ok';
    let myVariable3 = () => true;
    `
  );

  expect(
    project.searchInFile(sourceFile, [
      ts.SyntaxKind.VariableDeclaration,
      ts.SyntaxKind.ClassDeclaration,
      ts.SyntaxKind.FunctionDeclaration,
      ts.SyntaxKind.InterfaceDeclaration,
    ])
  ).toHaveLength(6);
});
