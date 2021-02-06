import ts from 'typescript';
import {TreeBuilderWithSymbols} from '../../tests/utils/TreeBuilderWithSymbols';
import {ReferenceSearcher} from '../ReferenceSearcher';
import {Item} from '../Item';

import {createTypeChecker} from './TypeCheckerStub';

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
    const symbolsCount = 4;
    let items: Item[];
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols({}, symbolsCount);
      for (let index = 0; index < symbolsCount; index++) {
        builder.addChildWithCommonSymbol(index);
      }

      items = builder
        .getResult()
        .getChildren()
        .map(node => new Item(node));
    });
    test('should find one reference', () => {
      expect(items).toHaveLength(symbolsCount);
    });
  });
});
