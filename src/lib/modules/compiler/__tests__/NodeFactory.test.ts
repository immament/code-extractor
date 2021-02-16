import {createTsNodeStub} from '@tests/utils/builders/createNodeStub';
import {createProgramContextStub} from '@tests/utils/builders/stubCreators';
import ts from 'typescript';
import {ProgramContext} from '../domain/ProgramContext';
import {SourceFile} from '../domain/SourceFile';
import {NodeFactory} from '../NodeFactory';

describe('NodeFactory', () => {
  let programContext: ProgramContext;

  beforeEach(() => {
    programContext = createProgramContextStub();
  });

  test('should create Node', () => {
    const factory = new NodeFactory(programContext);
    const tsNode = createTsNodeStub({}).asNode();
    const node = factory.create(tsNode);
    expect(node).toBeDefined();
  });

  test('should create Node with specified kind', () => {
    const expectedKind = ts.SyntaxKind.CallExpression;

    const factory = new NodeFactory(programContext);
    const tsNode = createTsNodeStub({kind: expectedKind}).asNode();
    const node = factory.create(tsNode);
    expect(node.kind).toBe(expectedKind);
  });

  test('should create SourceFile', () => {
    const expectedKind = ts.SyntaxKind.SourceFile;
    const factory = new NodeFactory(programContext);
    const tsNode = createTsNodeStub({kind: expectedKind}).asNode();
    const node = factory.create(tsNode);
    expect(node.kind).toBe(expectedKind);
    expect(node).toBeInstanceOf(SourceFile);
  });
});
