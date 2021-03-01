import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import {createProgram} from 'src/tests-common/utils/builders/createProgram';
import {Program} from '../../compiler/domain/Program';
import {FoundNode} from '../model/FoundNode';
import {Reference, ReferenceType} from '../model/Reference';
import {NodeSearcher} from '../NodeSearcher';
import {ReferenceSearcher} from '../ReferenceSearcher';

describe('ReferenceSearcher with TS', () => {
  let referenceSearcher: ReferenceSearcher;
  let nodeSearcher: NodeSearcher;
  let program: Program;

  describe('Search in one file', () => {
    test('should find Interface reference in one source file', () => {
      const foundNodes = initWithOneFile(
        `interface MyInterface {}
         class MyClass { myMethod() { return {} as MyInterface; }}
         const v = 1;`
      );

      expect(foundNodes).toHaveLength(3);
      expect(referenceSearcher.search(foundNodes).length).toBe(1);
    });

    test('should find Interface reference when use as variable type', () => {
      const foundNodes = initWithOneFile(
        `interface MyInterface {}
         const variable: MyInterface;`
      );

      expect(foundNodes).toHaveLength(2);
      expect(referenceSearcher.search(foundNodes).length).toBe(1);
    });
  });

  describe('Search in multiple files', () => {
    test('should find interface reference in use as variable type in diferent files', () => {
      const foundNodes = init(
        ['/interface.ts', 'export interface MyInterface {}'],
        [
          '/file.ts',
          `import { MyInterface } from './interface'
          const variable: MyInterface;`,
        ]
      );

      expect(foundNodes).toHaveLength(2);
      expect(referenceSearcher.search(foundNodes).length).toBe(1);
    });

    test('should find function references', () => {
      const items = init(
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

      //expect(items).toHaveLength(4);
      expect(referenceSearcher.search(items).length).toBe(7);
    });

    test('should find vaiable references when use import alias', () => {
      const foundNodes = init(
        ['/index.ts', 'export interface MyInterface {}'],
        [
          '/file.ts',
          `import { MyInterface as alias2 } from '.'
        const a: alias2;`,
        ]
      );
      const searchResult = referenceSearcher.search(foundNodes);

      expect(foundNodes).toHaveLength(2);
      expect(searchResult.length).toBe(1);
    });
  });

  describe('Reference types', () => {
    test('should find base class', () => {
      const foundNodes = initWithOneFile(
        `export class Class1 {}
         export class Class2 extends Class1 {}`
      );

      const references = referenceSearcher.search(foundNodes);

      expect(references).toHaveLength(1);
      expectReference(references[0], {
        from: foundNodes[1],
        to: foundNodes[0],
        type: 'Extends',
      });
    });

    test('should find class implemented class', () => {
      const foundNodes = initWithOneFile(
        `export class Class1 {}
         export class Class2 implements Class1 {}`
      );

      const references = referenceSearcher.search(foundNodes);

      expect(references).toHaveLength(1);
      expectReference(references[0], {
        from: foundNodes[1],
        to: foundNodes[0],
        type: 'Implements',
      });
    });

    test('should find class implemented interface', () => {
      const foundNodes = initWithOneFile(
        `export interface Interface1 {}
         export class Class2 implements Interface1 {}`
      );

      const references = referenceSearcher.search(foundNodes);

      expect(references).toHaveLength(1);
      expectReference(references[0], {
        from: foundNodes[1],
        to: foundNodes[0],
        type: 'Implements',
      });
    });

    test('should find interface extends interface', () => {
      const foundNodes = initWithOneFile(
        `export interface Interface1 {}
         export interface Interface2 extends Interface1 {}`
      );

      const references = referenceSearcher.search(foundNodes);

      expect(references).toHaveLength(1);
      expectReference(references[0], {
        from: foundNodes[1],
        to: foundNodes[0],
        type: 'Extends',
      });
    });
  });

  // HELPERS
  function initWithOneFile(content: string) {
    return init(['/index.ts', content]);
  }

  function init(...files: [name: string, content: string][]) {
    program = createProgram(files);
    referenceSearcher = new ReferenceSearcher(program.getTypeChecker());
    nodeSearcher = new NodeSearcher(program.getContext());

    return searchNodes([
      NodeKind.InterfaceDeclaration,
      NodeKind.ClassDeclaration,
      NodeKind.VariableDeclaration,
      NodeKind.FunctionDeclaration,
    ]);
  }

  function searchNodes(kinds: NodeKind[]) {
    const sourceFiles = program.getSourceFiles();
    // .filter(sf => !sf.isDeclarationFile);
    return nodeSearcher.searchInFiles(
      sourceFiles.map(sf => sf),
      kinds
    );
  }

  function expectReference(
    received: Reference,
    expected: {from: FoundNode; to: FoundNode; type: ReferenceType}
  ) {
    expect(received.from).toBe(expected.from);
    expect(received.to).toBe(expected.to);
    expect(received.type).toBe(expected.type);
  }
});
