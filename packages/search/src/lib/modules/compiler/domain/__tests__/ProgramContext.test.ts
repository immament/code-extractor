import {createTsNodeStub} from '@tests/utils/builders/createNodeStub';
import {createProgram} from '@tests/utils/builders/createProgram';
import {ProgramContext} from '../ProgramContext';
import {NodeKind} from '../SyntaxKind';

describe('ProgramContext.getNodeOrCreate', () => {
  test('should create node with specified kind', () => {
    const context = new ProgramContext(createProgram([]));
    const expectedKind = NodeKind.CallExpression;
    const tsNode = createTsNodeStub({kind: expectedKind}).asNode();

    const node = context.getNodeOrCreate(tsNode);
    expect(node).toBeDefined();
    expect(node.kind).toBe(expectedKind);
  });

  test('should returns the same node for every call with the same ts.Node', () => {
    const context = new ProgramContext(createProgram([]));
    const tsNode = createTsNodeStub({}).asNode();

    const firstNode = context.getNodeOrCreate(tsNode);
    const secondNode = context.getNodeOrCreate(tsNode);
    expect(firstNode).toBe(secondNode);
  });

  test('should returns different node for every call with different ts.Node', () => {
    const context = new ProgramContext(createProgram([]));
    const tsNode1 = createTsNodeStub({}).asNode();
    const tsNode2 = createTsNodeStub({}).asNode();

    const node1 = context.getNodeOrCreate(tsNode1);
    const node2 = context.getNodeOrCreate(tsNode2);
    expect(node1).not.toBe(node2);
  });
});
