import {TypeChecker} from '@lib/modules/compiler/domain/TypeChecker';
import {createProgram} from '@tests/utils/builders/createProgram';
import ts from 'typescript';
import {Node} from '../Node';

describe('TypeChecker', () => {
  let typeChecker: TypeChecker;
  let testNode: Node;

  test('should getSymbol for imported function', () => {
    init(
      ['/file1.ts', 'export function fun1() {}'],
      [
        '/file2.ts',
        `import { fun1 } from './file1'
        fun1();`,
      ]
    );

    const symbol = typeChecker.getSymbol(testNode);
    expect(symbol).toBeDefined();
    expect(symbol!.internal.valueDeclaration.getSourceFile().fileName).toBe(
      '/file1.ts'
    );
  });

  test('should getSymbol returns imported specifier symbol when exportet symbol not avaiable', () => {
    init([
      '/file2.ts',
      `import { fun1 } from './file1'
        fun1();`,
    ]);

    const symbol = typeChecker.getSymbol(testNode);
    expect(symbol).toBeDefined();

    expect(symbol!.internal.valueDeclaration).toBeUndefined();
    expect(symbol!.internal.declarations[0].kind).toBe(
      ts.SyntaxKind.ImportSpecifier
    );
  });

  function init(...files: [string, string][]) {
    const program = createProgram(files);
    typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFile('/file2.ts');
    expect(sourceFile).toBeDefined();
    testNode = search(
      sourceFile!,
      node =>
        node.kind === ts.SyntaxKind.Identifier &&
        node.internal.parent.kind === ts.SyntaxKind.CallExpression
    )!;

    expect(testNode).toBeDefined();
  }
});

function search(
  node: Node,
  isSearchType: (node: Node) => boolean
): Node | undefined {
  // console.log(tsPrinter.nodePrinter.printNode(node.internal));
  if (isSearchType(node)) return node;
  return node.forEachChild(child => search(child, isSearchType));
}
