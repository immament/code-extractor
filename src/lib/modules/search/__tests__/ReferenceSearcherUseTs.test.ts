import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {createProgram} from '@tests/utils/builders/createProgram';
import {Program} from '../../compiler/domain/Program';
import {NodeSearcher} from '../NodeSearcher';
import {ReferenceSearcher} from '../ReferenceSearcher';

describe('ReferenceSearcher with TS', () => {
  let searcher: ReferenceSearcher;
  let nodeSearcher: NodeSearcher;
  let program: Program;

  describe('Search in one file', () => {
    test('should find Interface reference in one source file', () => {
      init([
        '/index.ts',
        `interface MyInterface {}
         class MyClass {
          myMethod() { return {} as MyInterface; }
      }
      const v = 1;`,
      ]);

      const items = searchNodes([
        NodeKind.InterfaceDeclaration,
        NodeKind.ClassDeclaration,
        NodeKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(3);
      expect(searcher.search(items).length).toBe(1);
    });

    test('should find Interface reference when use as variable type', () => {
      init([
        '/index.ts',
        `interface MyInterface {}
           const variable: MyInterface;`,
      ]);

      const items = searchNodes([
        NodeKind.InterfaceDeclaration,
        NodeKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(2);
      expect(searcher.search(items).length).toBe(1);
    });

    test.todo(
      'Item inside Item - later because currently search only exported nodes'
    );
    // , () => {
    //   init([
    //     ['/index.ts', 'class MyClass { method() {  const variable = 1; } }'],
    //   ]);

    //   const items = searchItems([
    //     NodeKind.ClassDeclaration,
    //     NodeKind.VariableDeclaration,
    //   ]);

    //   expect(items).toHaveLength(2);
    //   const references = searcher.search(items);
    //   expect(references.length).toBe(0);
    // });
  });

  describe('Search in multiple files', () => {
    test('should find interface reference in use as variable type in diferent files', () => {
      init(
        ['/interface.ts', 'export interface MyInterface {}'],
        [
          '/file.ts',
          `import { MyInterface } from './interface'
          const variable: MyInterface;`,
        ]
      );
      const items = searchNodes([
        NodeKind.InterfaceDeclaration,
        NodeKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(2);
      expect(searcher.search(items).length).toBe(1);
    });

    test('should find function references', () => {
      init(
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
           const v3 = () => myFunction();`,
        ]
      );
      const items = searchNodes([
        NodeKind.InterfaceDeclaration,
        NodeKind.ClassDeclaration,
        NodeKind.VariableDeclaration,
        NodeKind.FunctionDeclaration,
      ]);

      //expect(items).toHaveLength(4);
      expect(searcher.search(items).length).toBe(7);
    });

    test('should find vaiable references when use import alias', () => {
      init(
        ['/index.ts', 'export interface MyInterface {}'],
        [
          '/file.ts',
          `import { MyInterface as alias2 } from '.'
        const a: alias2;`,
        ]
      );
      const items = searchNodes([
        NodeKind.InterfaceDeclaration,
        NodeKind.VariableDeclaration,
      ]);

      expect(items).toHaveLength(2);
      const searchResult = searcher.search(items);
      expect(searchResult.length).toBe(1);
    });
  });

  describe.skip('Reference types -- to do after ClassDeclarationNode', () => {
    test.only('should find class extends', () => {
      init([
        '/index.ts',
        `export class Class1 {}
         export class Class2 extends Class1 {}`,
      ]);
      const items = searchNodes([NodeKind.ClassDeclaration]);

      const searchResult = searcher.search(items);

      const node = searchResult[0]?.from.getNode();
      //const tsNode = searchResult[0]?.from.getTsNode();

      if (node) {
        //ts.isClassDeclaration(tsNode)
        // const clause = tsNode.heritageClauses?.find(
        //   hc => hc.token === NodeKind.ExtendsKeyword
        // );
        // clause &&
        //   console.log(clause.types.map(t => tsPrinter.nodePrinter.prepare(t)));
        // console.log(
        //   node
        //     .getTsType()
        //     .getBaseTypes()
        //     ?.map(t => prepareToPrint(t))
        // );
        // console.log(prepareToPrint(searchResult[0]?.to.getNode().getTsType()));
        // console.log(
        //   prepareToPrint(searchResult[0]?.from.getNode().getTsType())
        // );
      }

      // node &&
      //   console.log(
      //     util.inspect(tsPrinter.nodePrinter.prepare(node), {
      //       colors: true,
      //       depth: 5,
      //       compact: true,
      //     })
      //   );
      expect(searchResult.length).toBe(1);
    });
  });

  function init(...files: [name: string, content: string][]) {
    program = createProgram(files);
    searcher = new ReferenceSearcher(program.getTypeChecker());
    nodeSearcher = new NodeSearcher(program.getContext());
  }

  function searchNodes(kinds: NodeKind[]) {
    const sourceFiles = program.getSourceFiles();
    // .filter(sf => !sf.isDeclarationFile);
    return nodeSearcher.searchInFiles(
      sourceFiles.map(sf => sf),
      kinds
    );
  }
});
