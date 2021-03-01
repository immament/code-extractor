import {createTsNodeStub} from 'src/tests-common/utils/builders/createNodeStub';
import {createProgramContextStub} from 'src/tests-common/utils/builders/stubCreators';
import {Node} from '../Node';
import {Program} from '../Program';
import {ProgramContext} from '../ProgramContext';
import {NodeKind} from '../SyntaxKind';

test('should return Syntax Kind text', () => {
  const node = new Node(
    {} as ProgramContext,
    createTsNodeStub({kind: NodeKind.ClassDeclaration}).asNode()
  );

  expect(node.getKindText()).toBe('ClassDeclaration');
});

test('should getSymbol return cached value', () => {
  const mockTypeCheckerGetSymbol = jest
    .fn(() => ({}))
    .mockName('TypeChecker.getSymbol');
  const program = {
    getTypeChecker: () => ({getSymbol: mockTypeCheckerGetSymbol}),
  };

  const programContext = createProgramContextStub(
    (program as unknown) as Program
  );
  const node = new Node(
    programContext,
    createTsNodeStub({kind: NodeKind.ClassDeclaration}).asNode()
  );
  const receivedSymbol = node.getSymbol();
  expect(receivedSymbol).toBeDefined();
  expect(mockTypeCheckerGetSymbol).toHaveBeenCalledTimes(1);
  expect(node.getSymbol()).toBe(receivedSymbol);
  expect(mockTypeCheckerGetSymbol).toHaveBeenCalledTimes(1);
});
