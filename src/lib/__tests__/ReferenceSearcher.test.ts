import ts from 'typescript';
import {
  AddFromObjectArgs,
  TreeBuilderWithSymbols,
} from '../../tests/utils/TreeBuilderWithSymbols';
import {ReferenceSearcher} from '../ReferenceSearcher';
import {Item} from '../Item';

import {createTypeChecker} from '../../tests/stubs/TypeCheckerStub';

describe('ReferenceSearcher', () => {
  let builder: TreeBuilderWithSymbols;
  let searcher: ReferenceSearcher;

  beforeEach(() => {
    searcher = new ReferenceSearcher(createTypeChecker());
  });

  describe('Not find anything', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols();
    });
    test('should not find anything', () => {
      const items: Item[] = [];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should not find itself', () => {
      const node = builder.addChildAndGoTo().getResult();
      const items: Item[] = [new Item(node)];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should exlude reference to ancestor', () => {
      builder.addChildWithSymbolAndGoTo().addChildWithSymbol();

      const items: Item[] = [new Item(builder.currentAsNode)];
      expect(searcher.search(items)).toHaveLength(0);
    });
  });

  describe('find something', () => {
    let referencedNode: ts.Node;

    beforeEach(() => {
      builder = new TreeBuilderWithSymbols();
      referencedNode = builder.addChildWithSymbolAndGoTo().getResult();
      builder.reset();
    });

    test('should find one reference', () => {
      const nodeWithReference = builder
        .reset({})
        .addChildWithSymbol()
        .getResult();
      const items = [new Item(nodeWithReference), new Item(referencedNode)];

      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one reference from 3 level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one reference from 4 level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find 2 references from one item in different level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbolAndGoTo()
        .addChildWithSymbol()
        .getResult();

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
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

      const items: Item[] = [
        new Item(nodeWithReference),
        new Item(referencedNode),
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
      expect(searcher.search(items)).toHaveLength(1);
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

      expect(searcher.search(items)).toHaveLength(4);
    });

    test('should find 3 references', () => {
      init(createTreeWith4ItemsAnd3ValidReferences());

      expect(searcher.search(items)).toHaveLength(3);
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
        .map(node => new Item(node));
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
