import ts from 'typescript';
import {
  AddFromObjectArgs,
  TreeBuilderWithSymbols,
} from '../../tests/utils/TreeBuilderWithSymbols';
import {
  ReferenceSearcher,
  ReferenceSearcherContext,
  ReferenceSearcherError,
} from '../ReferenceSearcher';
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

    test('should exlude connection to ancestor', () => {
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

    test('should find one connection from 3 level', () => {
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

    test('should find one connection from 4 level', () => {
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

    test('should find 2 connections from one item in different level', () => {
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

    test('should find 3 connections from one item in the same level', () => {
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

    test('should find 2 connections from 2 different items', () => {
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
      init({
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
      });

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
  });
});

describe('ReferenceSearcherContext', () => {
  test('should throw exception when addResult without context items set', () => {
    const context = new ReferenceSearcherContext(createTypeChecker(), []);
    expect(() => context.addReference({} as Item)).toThrow(
      ReferenceSearcherError
    );
  });
});

/*
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function example() {
  const a = {
    childs: [
      {},
      {
        symbol: 1,
        childs: [
          {symbol: 2},
          {
            symbol: 2,
            childs: [
              {},
              {
                symbol: 0,
                childs: [{symbol: 0}, {symbol: 1}],
              },
            ],
          },
        ],
      },
    ],
  };

  const c2 = `
<node>
<node/>
<node symbol='1'>
    <node symbol='2'/>
    <node  symbol='1'>
        <node/>
        <node symbol='0'>
            <node symbol='0'/>
         `;

  const z1 = `
-s1
--s2
--s0
---s4
---7
-
--
---3
---
---3
--
-
--
`;

  const table = [
    {id: 1, parent: 0, symbol: 2},
    {id: 2, parent: 0},
    {id: 3, parent: 0},
    {id: 4, parent: 1, symbol: 2},
    {id: 5, parent: 1},
    {id: 6, parent: 1, symbol: 3},
    {id: 7, parent: 0},
    {id: 8, parent: 7},
    {id: 9, parent: 8},
    {id: 10, parent: 3},
  ];

  const c = `
<node>
<node/>
<node symbol='1'>
    <node symbol='2'/>
    <node symbol='1'>
        <node />
        <node symbol='0'>
            <node symbol='0'/>
        </node>
    </node>
</node>
</node>`;
}

*/
