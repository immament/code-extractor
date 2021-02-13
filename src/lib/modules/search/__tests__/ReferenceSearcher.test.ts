import ts from 'typescript';
import {
  AddFromObjectArgs,
  TreeBuilderWithSymbols,
} from '@tests/utils/builders/TreeBuilderWithSymbols';
import {ReferenceSearcher} from '../ReferenceSearcher';
import {FoundNode} from '../model/FoundNode';

import {createTsTypeChecker} from '@tests/stubs/TypeCheckerStub';
import {NodeStub} from '@tests/stubs/NodeStub';
import {asNodeStub, referencesToNodeIds} from '@tests/utils/stub-mappers';

import {expectReferences} from '@tests/utils/expects';
import {TypeChecker} from '../../compiler/domain/TypeChecker';

describe('ReferenceSearcher', () => {
  let builder: TreeBuilderWithSymbols;
  let searcher: ReferenceSearcher;

  beforeEach(() => {
    searcher = new ReferenceSearcher(new TypeChecker(createTsTypeChecker()));
  });

  describe('Not find anything', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols();
    });
    test('should not find anything', () => {
      const items: FoundNode[] = [];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should not find itself', () => {
      const node = builder.addChildAndGoTo().getResult();
      const items: FoundNode[] = [new FoundNode(node)];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should exlude reference to ancestor', () => {
      builder.addChildWithSymbolAndGoTo().addChildWithSymbol();

      const items: FoundNode[] = [new FoundNode(builder.currentAsNode)];
      expect(searcher.search(items)).toHaveLength(0);
    });
  });

  describe('find something', () => {
    let referencedNode: ts.Node;
    let referencedNodStub: NodeStub;

    beforeEach(() => {
      builder = new TreeBuilderWithSymbols({});
      referencedNodStub = new NodeStub({
        symbol: builder.getCommonSymbol(0),
      });
      referencedNode = referencedNodStub.asNode();
    });

    test('should find one reference with corect from & to', () => {
      const nodeWithReference = builder.addChildWithSymbol().getResultStub();

      const items = [
        new FoundNode(nodeWithReference.asNode()),
        new FoundNode(referencedNode),
      ];

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

      const items: FoundNode[] = [
        new FoundNode(nodeWithReference.asNode()),
        new FoundNode(referencedNode),
      ];

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

      const items: FoundNode[] = [
        new FoundNode(nodeWithReference.asNode()),
        new FoundNode(referencedNode),
      ];

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

      const items: FoundNode[] = [
        new FoundNode(nodeWithReference),
        new FoundNode(referencedNode),
      ];
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

      const items: FoundNode[] = [
        new FoundNode(nodeWithReference),
        new FoundNode(referencedNode),
      ];

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

      const items: FoundNode[] = [
        new FoundNode(nodeWithReference1),
        new FoundNode(referencedNode),
        new FoundNode(nodeWithReference2),
      ];

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
      init(createTreeWith4ItemsAnd3ValidReferences());

      const searchResult = searcher.search(items);
      expect(searchResult).toHaveLength(3);
      expectReferences(searchResult).toBeFromItemToItem(items, [
        [0, 1],
        [0, 2],
        [0, 1],
      ]);
    });

    // TODO REMOVE
    test('should ', () => {
      init({
        childs: [{kind: 1, symbol: 0, childs: [{kind: 2, symbol: 1}]}],
      });

      const childNode = asNodeStub(items[0].getNode()).getChild(0);
      //console.log(childNode);
      //console.log(builder.getResult());
      items.push(new FoundNode(childNode.asNode()));

      const searchResult = searcher.search(items);
      //console.log(searchResult);
      expectReferences(searchResult).toBeFromItemToItem(items, [[0, 1]]);
    });

    function init(addFromObjectArgs: AddFromObjectArgs) {
      builder = new TreeBuilderWithSymbols(undefined, symbolsCount);
      builder.addFromObject(addFromObjectArgs);
      items = createItemsFromBuilder(builder);
    }

    function createItemsFromBuilder(builder: TreeBuilderWithSymbols) {
      return builder
        .getResult()
        .getChildren()
        .map(node => new FoundNode(node));
    }

    function createTreeWith4ItemsAnd3ValidReferences() {
      return {
        // root chidls are Items
        childs: [
          {
            symbol: 0,
            childs: [
              {
                childs: [
                  {},
                  {
                    symbol: 1, // should find
                    childs: [
                      {symbol: 2}, // should find
                      {
                        symbol: 1, // should find
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
                ],
              },
            ],
          },
          {symbol: 1},
          {symbol: 2},
        ],
      };
    }
  });
});
