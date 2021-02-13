import {TypeChecker} from '@lib/modules/compiler/domain/TypeChecker';
import {createProgram} from '@tests/utils/builders/createProgram';

import ts from 'typescript';

describe('TypeChecker', () => {
  let typeChecker: TypeChecker;
  let testNode: ts.CallExpression;
  function init(files: [string, string][]) {
    const program = createProgram(files);
    typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFile('/file2.ts');
    expect(sourceFile).toBeDefined();
    testNode = search(sourceFile!.internal, ts.isCallExpression)!;
  }

  beforeEach(() => {});
  test('should getSymbol for imported function', () => {
    init([
      ['/file1.ts', 'export function fun1() {}'],
      [
        '/file2.ts',
        `import { fun1 } from './file1'
        fun1();`,
      ],
    ]);

    const symbol = typeChecker.getTsSymbol(testNode.expression);
    expect(symbol).toBeDefined();
    expect(symbol!.valueDeclaration.getSourceFile().fileName).toBe('/file1.ts');
  });

  test('should getSymbol returns imported specifier symbol when exportet symbol not avaiable', () => {
    init([
      [
        '/file2.ts',
        `import { fun1 } from './file1'
        fun1();`,
      ],
    ]);

    const symbol = typeChecker.getTsSymbol(testNode.expression);
    expect(symbol).toBeDefined();

    expect(symbol!.valueDeclaration).toBeUndefined();
    expect(symbol!.declarations[0].kind).toBe(ts.SyntaxKind.ImportSpecifier);
  });
});

function search<T extends ts.Node>(
  node: ts.Node,
  isSearchType: (node: ts.Node) => node is T
): T | undefined {
  if (isSearchType(node)) return node;
  return node.forEachChild<T>(child => {
    return search(child, isSearchType);
  });
}

// function createPrintSymbolCallback(
//   typeChecker: TypeChecker
// ): PrintNodeCallback {
//   return (node, {colors}) => {
//     const symbolName = typeChecker.getSymbol(node)?.getEscapedName();
//     return symbolName && colors.header(symbolName);
//   };
// }
