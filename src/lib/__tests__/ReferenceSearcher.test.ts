import ts from 'typescript';
import {TreeBuilderWithSymbols} from '../../tests/utils/TreeBuilderWithSymbols';
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
        .addChildWithSymbolAndGoTo()
        .getResult();
      const items = [new Item(nodeWithReference), new Item(referencedNode)];

      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one connection from 3 level', () => {
      const nodeWithReference = builder
        .addChildAndGoTo()
        .addChildAndGoTo()
        .addChildWithSymbolAndGoTo()
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
        .addChildWithSymbolAndGoTo()
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
        .addChildWithSymbolAndGoTo()
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
        .addChildWithSymbolAndGoTo()
        .getResult();

      const nodeWithReference2 = builder
        .reset()
        .addChildAndGoTo()
        .addChildWithSymbolAndGoTo()
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
        treeBuilder.addChildWithSymbol(index);
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
      builder.toChild().addChildWithSymbolAndGoTo(1);
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find 4 references', () => {
      builder
        .toChild()
        .addChildWithSymbolAndGoTo(1)
        .toRoot()
        .toChild(1)
        .addChildWithSymbolAndGoTo(2)
        .toRoot()
        .toChild(2)
        .addChildWithSymbolAndGoTo(3)
        .toRoot()
        .toChild(3)
        .addChildWithSymbolAndGoTo(0);

      expect(searcher.search(items)).toHaveLength(4);
    });
    test('should find 3 references', () => {
      builder
        .toChild()
        .addChildAndGoTo()
        .addChild()
        .addChildWithSymbolAndGoTo(1) // should find
        .addChildWithSymbol(2) // should find
        .addChildWithSymbolAndGoTo(1) // should find
        .addChild()
        .addChildWithSymbolAndGoTo(0) // should not find - reference to itself
        .addChildWithSymbol(0); // should not find - reference to itself

      expect(searcher.search(items)).toHaveLength(3);
    });
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
