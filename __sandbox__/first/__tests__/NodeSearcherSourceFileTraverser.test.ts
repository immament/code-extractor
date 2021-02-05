import {NodeSearcherSourceFileTraverser} from '../SearchNodeSourceFileTraverser';
import {TsNode} from '../Node';
import {TsSourceFile} from '../TsSourceFile';
import {SyntaxKind} from '../SyntaxKind';
import {mocked} from '../../tests/utils/mocked';
import ts from 'typescript';
import {NodeFilter} from '../NodeFilter';
import {FoundNode} from '../FoundNode';

jest.mock('../TsSourceFile');
jest.mock('../Node');

function createNode({kind}: {kind?: SyntaxKind} = {}) {
  const node = new TsNode({} as ts.Node);
  if (kind) mocked(node).getKind.mockReturnValue(kind);
  return node;
}

describe('.. SourceFileTraverser', () => {
  test('should traverse visit 2 files', () => {
    const traverser = new NodeSearcherSourceFileTraverser({});
    const sourceFiles: TsSourceFile[] = [
      new TsSourceFile(),
      new TsSourceFile(),
    ];

    traverser.traverse(sourceFiles[0]);
    traverser.traverse(sourceFiles[1]);
    expect(traverser.visitedFilesCount).toBe(2);
  });

  test('should traverse call forEachChild in source file', () => {
    const traverser = new NodeSearcherSourceFileTraverser({});
    const sourceFile = new TsSourceFile();
    const mockedSourceFile = mocked(sourceFile);
    traverser.traverse(sourceFile);

    expect(mockedSourceFile.forEachChild).toBeCalled();
  });

  test('should traverse visit all descendents', () => {
    const traverser = new NodeSearcherSourceFileTraverser({});
    const sourceFile = new TsSourceFile();
    const mockedSourceFile = mocked(sourceFile);

    const node = createNode();
    const mockedNode = mocked(node);
    const childNodes = [node, node];

    mockedSourceFile.forEachChild.mockImplementation(cb => {
      childNodes.forEach(node => {
        cb(node);
      });
    });

    traverser.traverse(sourceFile);

    expect(mockedNode.forEachChild).toBeCalledTimes(childNodes.length);
  });

  test('should not found specified kind when source file not contains it', () => {
    const traverser = new NodeSearcherSourceFileTraverser({
      [SyntaxKind.ClassDeclaration]: {} as NodeFilter,
    });
    const sourceFile = new TsSourceFile();
    traverser.traverse(sourceFile);
    expect(traverser.getFoundNodes().length).toBe(0);
  });

  test('should found 2 node with specified kind', () => {
    const traverser = new NodeSearcherSourceFileTraverser({
      [SyntaxKind.ClassDeclaration]: {
        filter: () => ({} as FoundNode),
      } as NodeFilter,
    });
    const sourceFile = new TsSourceFile();

    const childNodes: TsNode[] = [
      createNode({kind: SyntaxKind.ClassDeclaration}),
      createNode(),
      createNode(),
      createNode({kind: SyntaxKind.ClassDeclaration}),
      createNode(),
    ];
    const mockedSourceFile = mocked(sourceFile);
    mockedSourceFile.forEachChild.mockImplementation(cb => {
      childNodes.forEach(node => {
        cb(node);
      });
    });

    traverser.traverse(sourceFile);
    expect(traverser.getFoundNodes().length).toBe(2);
  });

  test('should found 3 diffrents kinds', () => {
    const traverser = new NodeSearcherSourceFileTraverser({
      [SyntaxKind.ClassDeclaration]: {
        filter: () => ({} as FoundNode),
      } as NodeFilter,
      [SyntaxKind.AbstractKeyword]: {
        filter: () => ({} as FoundNode),
      } as NodeFilter,
      [SyntaxKind.InterfaceDeclaration]: {
        filter: () => ({} as FoundNode),
      } as NodeFilter,
    });
    const sourceFile = new TsSourceFile();

    const childNodes: TsNode[] = [
      createNode({kind: SyntaxKind.InterfaceDeclaration}),
      createNode(),
      createNode({kind: SyntaxKind.AbstractKeyword}),
      createNode({kind: SyntaxKind.ClassDeclaration}),
      createNode(),
    ];
    const mockedSourceFile = mocked(sourceFile);
    mockedSourceFile.forEachChild.mockImplementation(cb => {
      childNodes.forEach(node => {
        cb(node);
      });
    });

    traverser.traverse(sourceFile);
    expect(traverser.getFoundNodes().length).toBe(3);
  });
});
