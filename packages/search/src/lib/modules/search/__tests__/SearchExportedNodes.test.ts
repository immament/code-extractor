import {Program} from '@lib/modules/compiler/domain/Program';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {createProgram} from '@tests/utils/builders/createProgram';
import {NodeSearcher} from '../NodeSearcher';

describe('Search exported nodes in source file', () => {
  let project: NodeSearcher;
  let program: Program;

  test('should find ClassDeclaration', () => {
    init([['/index.ts', 'export class MyClass {}']]);

    const result = project.searchExportedDeclarations(
      program.getSourceFile('/index.ts')!,
      [NodeKind.ClassDeclaration]
    );
    expect(result).toHaveLength(1);
    expect(result[0].getTsNode().kind).toBe(NodeKind.ClassDeclaration);
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
        NodeKind.InterfaceDeclaration,
        NodeKind.ClassDeclaration,
        NodeKind.VariableDeclaration,
        NodeKind.FunctionDeclaration,
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
        NodeKind.InterfaceDeclaration,
        NodeKind.ClassDeclaration,
        NodeKind.VariableDeclaration,
        NodeKind.FunctionDeclaration,
      ]
    );

    // console.log(...result.flatMap(tsPrinter.printItem));

    expect(result).toHaveLength(3);
  });

  function init(files: [name: string, content: string][]) {
    program = createProgram(files);
    project = new NodeSearcher(program.getContext());
  }
});
