import ts from 'typescript';
import {ReferenceSearcher} from '../ReferenceSearcher';
import {Project} from '../Project';
import {Program} from '../Program';
import {createInMemoryCompilerHost} from '../../tests/utils/createInMemoryCompilerHost';

describe('ReferenceSearcher', () => {
  let searcher: ReferenceSearcher;

  beforeEach(() => {
    // searcher = new ReferenceSearcher(createTypeChecker());
  });

  test('should find one connection from 3 level', () => {
    const files: [string, string][] = [
      [
        'index.ts',
        `interface MyInterface {}
         class MyClass {
          myMethod() { return {} as MyInterface; }
      }
      const v = 1;
      `,
      ],
    ];
    const compilerHost = createInMemoryCompilerHost(files);
    const program = new Program({
      rootNames: ['index.ts'],
      options: {},
      host: compilerHost,
    });

    const sourceFile = program.tsProgram.getSourceFile('index.ts');

    expect(sourceFile).toBeDefined();
    const project = new Project();
    const items = project.searchInFile(sourceFile!, [
      ts.SyntaxKind.InterfaceDeclaration,
      ts.SyntaxKind.ClassDeclaration,
      ts.SyntaxKind.VariableDeclaration,
    ]);

    // const typeChecker = program.tsProgram.getTypeChecker();
    // console.log(
    //   'empty symbol map',
    //   items.map(i => {
    //     const node = i.getNode() as ts.VariableDeclaration;
    //     return {
    //       symbol: typeChecker.getSymbolAtLocation(node.name!),
    //       s: (node as any).symbol,
    //     };
    //   })
    // );

    searcher = new ReferenceSearcher(program.tsProgram.getTypeChecker());
    expect(items).toHaveLength(3);
    expect(searcher.search(items).length).toBe(1);
  });
});
