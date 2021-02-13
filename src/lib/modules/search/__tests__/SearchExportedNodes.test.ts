import {NodeSearcher} from '../NodeSearcher';
import {createProgram} from '@tests/utils/builders/createProgram';
import {Program} from '@lib/modules/compiler/domain/Program';
import ts from 'typescript';

describe('Search exported nodes in source file', () => {
  let project: NodeSearcher;
  let program: Program;
  beforeEach(() => {
    project = new NodeSearcher();
  });

  test('should find ClassDeclaration', () => {
    init([['/index.ts', 'export class MyClass {}']]);

    const result = project.searchExportedDeclarations(
      program.getSourceFile('/index.ts')!,
      [ts.SyntaxKind.ClassDeclaration]
    );
    expect(result).toHaveLength(1);
    expect(result[0].getTsNode().kind).toBe(ts.SyntaxKind.ClassDeclaration);
  });

  test('should find 3 items', () => {
    init([
      [
        '/index.ts',
        `function fun1() { myFunction()}
    export function fun2(arg: typeof myFunction ) { }
    function fun3() { return myFunction; }
    export class ClassA {method1() { myFunction();}}
    export const v1 = myFunction;
    const v2 = myFunction();
    const v3 = () => myFunction();`,
      ],
    ]);

    const result = project.searchExportedDeclarations(
      program.getSourceFile('/index.ts')!,
      [
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
      ]
    );
    expect(result).toHaveLength(3);
  });

  test('should find 3 items', () => {
    init([
      ['/index.ts', 'export interface MyInterface {}'],
      [
        '/file1.ts',
        `import { MyInterface } from '.'
      export {MyInterface as Alias};
      `,
      ],

      [
        '/file2.ts',
        `import { Alias } from './file1.ts'
          export const v: Alias;
          export const v2 =  1;
      ;
      `,
      ],
    ]);

    const result = project.searchExportedDeclarationsInFiles(
      program.getSourceFiles(),
      [
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
      ]
    );

    // console.log(...result.flatMap(tsPrinter.printItem));

    expect(result).toHaveLength(3);
  });

  function init(files: [name: string, content: string][]) {
    program = createProgram(files);
  }
});
