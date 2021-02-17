import {TypeChecker} from '@lib/modules/compiler/domain/TypeChecker';
import {createProgram} from '@tests/utils/builders/createProgram';
import ts from 'typescript';
import {Node} from '../Node';

describe('TypeChecker', () => {
  let typeChecker: TypeChecker;
  let testNode: Node;

  test('should getSymbol for imported function', () => {
    init(
      `import { fun1 } from './file2'
        fun1();`,
      ['/file2.ts', 'export function fun1() {}']
    );

    const symbol = typeChecker.getSymbol(testNode);

    expect(symbol).toBeDefined();
    expect(symbol!.internal.valueDeclaration.getSourceFile().fileName).toBe(
      '/file2.ts'
    );
  });

  test('should getSymbol returns imported specifier symbol when exportet symbol not avaiable', () => {
    init(`import { fun1 } from './file2'
        fun1();`);

    const symbol = typeChecker.getSymbol(testNode);

    expect(symbol).toBeDefined();
    expect(symbol!.internal.valueDeclaration).toBeUndefined();
    expect(symbol!.internal.declarations[0].kind).toBe(
      ts.SyntaxKind.ImportSpecifier
    );
  });

  function init(testFileContent: string, ...files: [string, string][]) {
    const program = createProgram([['/file.ts', testFileContent], ...files]);
    typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFile('/file.ts');

    testNode = searchNode(
      sourceFile!,
      node =>
        node.kind === ts.SyntaxKind.Identifier &&
        node.internal.parent.kind === ts.SyntaxKind.CallExpression
    )!;

    expect(testNode).toBeDefined();

    function searchNode(
      node: Node,
      isSearchType: (node: Node) => boolean
    ): Node | undefined {
      return isSearchType(node)
        ? node
        : node.forEachChild(child => searchNode(child, isSearchType));
    }
  }
});
