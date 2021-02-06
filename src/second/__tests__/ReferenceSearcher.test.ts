import ts from 'typescript';
import {TreeBuilderWithSymbols} from '../../tests/utils/TreeBuilderWithSymbols';
import {ReferenceSearcher} from '../ReferenceSearcher';
import {Item} from '../Item';

import {createTypeChecker} from '../../tests/utils/TypeCheckerStub';

describe('ReferenceSearcher', () => {
  let builder: TreeBuilderWithSymbols;
  let searcher: ReferenceSearcher;

  beforeEach(() => {
    searcher = new ReferenceSearcher(createTypeChecker());
    builder = new TreeBuilderWithSymbols();
  });

  describe('Not find anything', () => {
    test('should not find anything', () => {
      const items: Item[] = [];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should not find itself', () => {
      const node = builder.addLevel().getResult();
      const items: Item[] = [new Item(node)];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should exlude connection to ancestor', () => {
      builder.addLevelWithCommonSymbol().addChildWithCommonSymbol();

      const items: Item[] = [new Item(builder.node)];
      expect(searcher.search(items)).toHaveLength(0);
    });
  });

  describe('find something', () => {
    let referencedNode: ts.Node;

    beforeEach(() => {
      referencedNode = builder.addLevelWithCommonSymbol().getResult();
      builder.reset();
    });

    test('should find one reference', () => {
      const nodeWithReference = builder
        .reset({})
        .addLevelWithCommonSymbol()
        .getResult();
      const items = [new Item(nodeWithReference), new Item(referencedNode)];

      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one connection from 3 level', () => {
      const nodeWithReference = builder
        .addLevel()
        .addLevel()
        .addLevelWithCommonSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one connection from 4 level', () => {
      const nodeWithReference = builder
        .addLevel()
        .addLevel()
        .addLevel()
        .addLevelWithCommonSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find 2 connections from one item in different level', () => {
      const nodeWithReference = builder
        .addLevel()
        .addLevel()
        .addLevelWithCommonSymbol()
        .addLevelWithCommonSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(2);
    });

    test('should find 3 connections from one item in the same level', () => {
      const nodeWithReference = builder
        .addLevel()
        .addLevel()
        .addChildWithCommonSymbol()
        .addChildWithCommonSymbol()
        .addChildWithCommonSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
      ];

      expect(searcher.search(items)).toHaveLength(3);
    });

    test('should find 2 connections from 2 different items', () => {
      const nodeWithReference1 = builder
        .addLevel()
        .addLevelWithCommonSymbol()
        .getResult();

      const nodeWithReference2 = builder
        .reset()
        .addLevel()
        .addLevelWithCommonSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference1),
        new Item(referencedNode),
        new Item(nodeWithReference2),
      ];

      expect(searcher.search(items)).toHaveLength(2);
    });
  });

  describe('Search references to mulitpile nodes', () => {
    function createTreeBuilderWithChildNodesWithSymbol(childCount: number) {
      const treeBuilder = new TreeBuilderWithSymbols({}, childCount);
      for (let index = 0; index < symbolsCount; index++) {
        treeBuilder.addChildWithCommonSymbol(index);
      }
      return treeBuilder;
    }

    function createItemsFromBuilder(builder: TreeBuilderWithSymbols) {
      return builder
        .getResult()
        .getChildren()
        .map(node => new Item(node));
    }

    const symbolsCount = 4;
    let items: Item[];

    beforeEach(() => {
      builder = createTreeBuilderWithChildNodesWithSymbol(symbolsCount);
      items = createItemsFromBuilder(builder);
    });

    test('should items count be equal used symbols', () => {
      expect(items).toHaveLength(symbolsCount);
    });

    test('should find nothing', () => {
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should find 1 reference', () => {
      builder.toChild().addLevelWithCommonSymbol(1);
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find 4 references', () => {
      builder
        .toChild()
        .addLevelWithCommonSymbol(1)
        .toRoot()
        .toChild(1)
        .addLevelWithCommonSymbol(2)
        .toRoot()
        .toChild(2)
        .addLevelWithCommonSymbol(3)
        .toRoot()
        .toChild(3)
        .addLevelWithCommonSymbol(0);

      expect(searcher.search(items)).toHaveLength(4);
    });
    test('should find 3 references', () => {
      builder
        .toChild()
        .addLevel()
        .addChild()
        .addLevelWithCommonSymbol(1) // should find
        .addChildWithCommonSymbol(2) // should find
        .addLevelWithCommonSymbol(1) // should find
        .addChild()
        .addLevelWithCommonSymbol(0) // should not find - reference to itself
        .addChildWithCommonSymbol(0); // should not find - reference to itself

      expect(searcher.search(items)).toHaveLength(3);
    });
  });
});
