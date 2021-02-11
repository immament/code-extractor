import ts from 'typescript';
import {ReferenceSearcher} from '../ReferenceSearcher';
import {Project} from '../Project';
import {Program} from '../Program';
import {createInMemoryCompilerHost} from '@tests/utils/createInMemoryCompilerHost';

import {TypeChecker} from '../TypeChecker';
import tsPrinter from '@tests/utils/TsPrinter';

describe('ReferenceSearcher with TS', () => {
  let searcher: ReferenceSearcher;
  let project: Project;
  let program: Program;

  describe('Search in one file', () => {
    test('should find Interface reference in one source file', () => {
      const files: [string, string][] = [
        [
          '/index.ts',
          `interface MyInterface {}
           class MyClass {
            myMethod() { return {} as MyInterface; }
        }
        const v = 1;
        `,
        ],
      ];

      init(files);

      const items = searchItems([
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(3);
      expect(searcher.search(items).length).toBe(1);
    });

    test('should find Interface reference when use as variable type', () => {
      init([
        [
          '/index.ts',
          `interface MyInterface {}
           const variable: MyInterface;`,
        ],
      ]);

      const items = searchItems([
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(2);
      expect(searcher.search(items).length).toBe(1);
    });

    test.skip('copy - should ... Item inside Item', () => {
      init([
        ['/index.ts', 'class MyClass { method() {  const variable = 1; } }'],
      ]);

      const items = searchItems([
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(2);
      const references = searcher.search(items);
      console.log(tsPrinter.printReferences(references));
      expect(references.length).toBe(0);
    });
  });

  describe('Search in multiple files', () => {
    test('should find interface reference in use as variable type in diferent files', () => {
      init([
        ['/interface.ts', 'export interface MyInterface {}'],
        [
          '/file.ts',
          `import { MyInterface } from './interface'
          const variable: MyInterface;`,
        ],
      ]);
      const items = searchItems([
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(2);
      expect(searcher.search(items).length).toBe(1);
    });

    test('should find function references', () => {
      init([
        [
          '/index.ts',
          `export interface MyInterface {}
          export class MyClass {
          export function myFunction() { }
          export const myVariable = 1;
        }
          `,
        ],
        [
          '/file.ts',
          `import { myFunction} from '.'
           function fun1() { myFunction()}
           function fun2(arg: typeof myFunction ) { }
           function fun3() { return myFunction; }
           class ClassA {
             method1() {
              myFunction();
             }
           }
           const v1 = myFunction;
           const v2 = myFunction();
           const v3 = () => myFunction();

           `,
        ],
      ]);
      const items = searchItems([
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
      ]);

      //expect(items).toHaveLength(4);
      expect(searcher.search(items).length).toBe(7);
    });

    test('should find vaiable references when use import alias', () => {
      init([
        [
          '/index.ts',
          `export interface MyInterface {}
        export class MyClass {
        export function myFunction() { }
        export const myVariable = 1;
      }
        `,
        ],
        [
          '/file.ts',
          `
        //import { myVariable as alias2 } from '.'
        //   function fun1() { return alias2; }
        //   function fun2(arg: typeof alias2 ) { }
        //  function fun3() { return alias2; }
         class ClassA {
           method1() {
              let y = 0;
           }
         }
          // const v1 = alias2;
          // const v2 = () => alias2;
         `,
        ],
      ]);
      const items = searchItems([
        ts.SyntaxKind.InterfaceDeclaration,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.FunctionDeclaration,
      ]);

      //expect(items).toHaveLength(11);
      const searchResult = searcher.search(items);
      expect(searchResult.length).toBe(2);
    });
  });

  function init(files: [name: string, content: string][]) {
    const compilerHost = createInMemoryCompilerHost(files);
    program = new Program({
      rootNames: files.map(([name]) => name),
      options: {},
      host: compilerHost,
    });

    // program = new Program({
    //   rootNames: [
    //     createPathToTestFile('interface.ts'),
    //     createPathToTestFile('file.ts'),
    //   ],
    //   options: {},
    // });

    searcher = new ReferenceSearcher(
      new TypeChecker(program.tsProgram.getTypeChecker())
    );
    project = new Project();
  }

  function searchItems(kinds: ts.SyntaxKind[]) {
    const sourceFiles = program.tsProgram.getSourceFiles();
    // .filter(sf => !sf.isDeclarationFile);
    return project.searchInFiles(sourceFiles, kinds);
  }
});
