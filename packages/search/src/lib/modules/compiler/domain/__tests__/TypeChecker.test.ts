import {TypeChecker} from '@lib/modules/compiler/domain/TypeChecker';
import {createProgram} from 'src/tests-common/utils/builders/createProgram';
import {searchNode} from 'src/tests-common/utils/node-utils';
import {Node} from '../Node';
import {NodeKind} from '../SyntaxKind';

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
      NodeKind.ImportSpecifier
    );
  });

  function init(testFileContent: string, ...files: [string, string][]) {
    const program = createProgram([['/file.ts', testFileContent], ...files]);
    typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFile('/file.ts');

    testNode = searchNode(
      sourceFile!,
      node =>
        node.kind === NodeKind.Identifier &&
        node.internal.parent.kind === NodeKind.CallExpression
    )!;

    expect(testNode).toBeDefined();
  }
});
