import {Node} from '@imm/ts-common/src/lib/modules/compiler/domain/Node';
import {Program} from '@imm/ts-common/src/lib/modules/compiler/domain/Program';
import {ProgramContext} from '@imm/ts-common/src/lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@imm/ts-common/src/lib/modules/compiler/domain/SyntaxKind';
import {TypeChecker} from '@imm/ts-common/src/lib/modules/compiler/domain/TypeChecker';
import {NodeStub} from '@imm/ts-common/src/tests/stubs/NodeStub';
import {createTsTypeChecker} from '@imm/ts-common/src/tests/stubs/TypeCheckerStub';
import {createTsNodeStub} from '@imm/ts-common/src/tests/utils/builders/createNodeStub';
import {
  AddFromObjectArgs,
  TreeBuilderWithSymbols,
} from '@imm/ts-common/src/tests/utils/builders/TreeBuilderWithSymbols';
import ts from 'typescript';
import {expectReferences} from '../../../../tests/utils/expects';
import {referencesToNodeIds} from '../../../../tests/utils/stub-mappers';
import {FoundNode} from '../model/FoundNode';
import {ReferenceSearcher} from '../ReferenceSearcher';

describe('ReferenceSearcher', () => {
  let builder: TreeBuilderWithSymbols;
  let searcher: ReferenceSearcher;
  let context: ProgramContext;
  let typeChecker: TypeChecker;
  let defaultSourceFile: ts.SourceFile;

  beforeEach(() => {
    defaultSourceFile = createTsNodeStub({
      kind: NodeKind.SourceFile,
    }).asNode() as ts.SourceFile;

    const program = {
      getTypeChecker() {
        return typeChecker;
      },
    } as Program;
    context = new ProgramContext(program);
    typeChecker = new TypeChecker(context, createTsTypeChecker());

    searcher = new ReferenceSearcher(
      new TypeChecker({} as ProgramContext, createTsTypeChecker())
    );
  });

  describe('Not find anything', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols({
        defaultSourceFile,
      });
    });

    test('should not find anything', () => {
      const items: FoundNode[] = [];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should not find itself', () => {
      const node = builder.addChildAndGoTo().getResult();

      const items = createFoundNodes([node]);
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should exlude reference to ancestor', () => {
      builder.addChildWithSymbolAndGoTo().addChildWithSymbol();
      const items = createFoundNodes([builder.currentAsNode]);

      expect(searcher.search(items)).toHaveLength(0);
    });
  });

  describe('find something', () => {
    let referencedNode: ts.Node;
    let referencedNodStub: NodeStub;

    beforeEach(() => {
      builder = new TreeBuilderWithSymbols({
        createNodeArgs: {},
        defaultSourceFile,
      });
      referencedNodStub = createTsNodeStub({
        symbol: builder.getCommonSymbol(0),
        sourceFile: defaultSourceFile,
      });
      referencedNode = referencedNodStub.asNode();
    });

    test('should find one reference with correct from & to', () => {
      const nodeWithReference = builder.addChildWithSymbol().getResultStub();
      const items = createFoundNodes([
        nodeWithReference.asNode(),
        referencedNode,
      ]);

      const searchResult = searcher.search(items);

      expect(searchResult).toHaveLength(1);
      expect(referencesToNodeIds(searchResult)).toEqual([
        {
          fromId: nodeWithReference.id,
          toId: referencedNodStub.id,
        },
      ]);
    });

    test('should find one reference from 3 level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbol()
        .getResultStub();

      const items = createFoundNodes([
        nodeWithReference.asNode(),
        referencedNode,
      ]);

      const searchResult = searcher.search(items);
      expect(searchResult).toHaveLength(1);
      expect(referencesToNodeIds(searchResult)).toEqual([
        {
          fromId: nodeWithReference.id,
          toId: referencedNodStub.id,
        },
      ]);
    });

    test('should find one reference from 4 level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbol()
        .getResultStub();

      const items = createFoundNodes([
        nodeWithReference.asNode(),
        referencedNode,
      ]);

      const searchResult = searcher.search(items);
      expect(searchResult).toHaveLength(1);
      expect(referencesToNodeIds(searchResult)).toEqual([
        {
          fromId: nodeWithReference.id,
          toId: referencedNodStub.id,
        },
      ]);
    });

    test('should find 2 references from one item in different level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbolAndGoTo()
        .addChildWithSymbol()
        .getResult();

      const items = createFoundNodes([nodeWithReference, referencedNode]);
      expect(searcher.search(items)).toHaveLength(2);
    });

    test('should find 3 references from one item in the same level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbol()
        .addChildWithSymbol()
        .addChildWithSymbol()
        .getResult();

      const items = createFoundNodes([nodeWithReference, referencedNode]);
      expect(searcher.search(items)).toHaveLength(3);
    });

    test('should find 2 references from 2 different items', () => {
      const nodeWithReference1 = builder
        .addChildAndGoTo()
        .addChildWithSymbol()
        .getResult();

      const nodeWithReference2 = builder
        .reset()
        .addChildAndGoTo()
        .addChildWithSymbol()
        .getResult();

      const items = createFoundNodes([
        nodeWithReference1,
        referencedNode,
        nodeWithReference2,
      ]);

      expect(searcher.search(items)).toHaveLength(2);
    });
  });

  describe('Search references to mulitpile nodes', () => {
    const symbolsCount = 4;
    let items: FoundNode[];

    test('should items count be equal 4', () => {
      init({
        childs: [{symbol: 0}, {symbol: 1}, {symbol: 2}, {symbol: 3}],
      });
      expect(items).toHaveLength(4);
    });

    test('should find nothing', () => {
      init({
        childs: [
          {symbol: 0, childs: [{symbol: 0}]},
          {symbol: 1, childs: [{}, {}]},
          {symbol: 2, childs: [{}]},
          {symbol: 3, childs: [{}]},
        ],
      });

      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should find 1 reference', () => {
      init({
        childs: [
          {symbol: 0},
          {symbol: 1, childs: [{symbol: 2}]},
          {symbol: 2},
          {symbol: 3},
        ],
      });

      const searchResult = searcher.search(items);
      expect(searchResult).toHaveLength(1);
      expectReferences(searchResult).toBeFromItemToItem(items, [[1, 2]]);
    });

    test('should find 4 references', () => {
      init({
        childs: [
          {symbol: 0, childs: [{symbol: 1}]},
          {symbol: 1, childs: [{symbol: 2}]},
          {symbol: 2, childs: [{symbol: 3}]},
          {symbol: 3, childs: [{symbol: 0}]},
        ],
      });

      const searchResult = searcher.search(items);
      expect(searchResult).toHaveLength(4);
      expectReferences(searchResult).toBeFromItemToItem(items, [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ]);
    });

    test('should find 3 references', () => {
      init(createTreeWith3FoundNodesAnd3ValidReferences());

      const searchResult = searcher.search(items);
      expect(searchResult).toHaveLength(3);
      expectReferences(searchResult).toBeFromItemToItem(items, [
        [0, 1],
        [0, 2],
        [0, 1],
      ]);
    });

    function init(addFromObjectArgs: AddFromObjectArgs) {
      builder = new TreeBuilderWithSymbols({
        symbolCounts: symbolsCount,
        defaultSourceFile,
      });
      builder.addFromObject(addFromObjectArgs);
      items = createItemsFromBuilder(builder);
    }

    function createItemsFromBuilder(builder: TreeBuilderWithSymbols) {
      return builder
        .getResult()
        .getChildren()
        .map(node => createFoundNode(node));
    }

    function createTreeWith3FoundNodesAnd3ValidReferences() {
      // root chidls are FoundNodes
      return {
        childs: [
          {symbol: 0, childs: createChildsWithReferences()},
          {symbol: 1},
          {symbol: 2},
        ],
      };

      function createChildsWithReferences() {
        return [
          {},
          {
            symbol: 1,
            childs: [
              {symbol: 2},
              {
                symbol: 1,
                childs: [
                  {},
                  {
                    symbol: 0, // should not find - reference to itself
                    childs: [{symbol: 0}], // should not find - reference to itself
                  },
                ],
              },
            ],
          },
        ];
      }
    }
  });

  function createFoundNode(node: ts.Node) {
    return new FoundNode(new Node(context, node));
  }

  function createFoundNodes(nodes: ts.Node[]) {
    return nodes.map(n => createFoundNode(n));
  }
});
