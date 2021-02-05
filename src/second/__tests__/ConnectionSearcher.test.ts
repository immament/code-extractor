import ts from 'typescript';
import {ConnectionSearcher} from '../ConnectionSearcher';
import {Item} from '../Item';
import {createNode} from './NodeStub';

import {createTypeChecker} from './TypeCheckerStub';

describe('ConnectionSearcher', () => {
  let searcher: ConnectionSearcher;

  function newSymbol() {
    return {} as ts.Symbol;
  }

  function newNodeWithNewSymbol(nodes?: ts.Node[]) {
    return createNode({symbol: newSymbol(), nodes});
  }

  beforeEach(() => {
    searcher = new ConnectionSearcher(createTypeChecker());
  });

  describe('Not find anything', () => {
    test('should not find anything', () => {
      const items: Item[] = [];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should not find itself', () => {
      const node = newNodeWithNewSymbol();
      const items: Item[] = [new Item(node)];
      expect(searcher.search(items)).toHaveLength(0);
    });

    test('should exlude connection to ancestor', () => {
      const commonSymbol = newSymbol();
      const itemNode = createNode({
        nodes: [createNode({symbol: commonSymbol})],
        symbol: commonSymbol,
      });

      const items: Item[] = [new Item(itemNode)];
      expect(searcher.search(items)).toHaveLength(0);
    });
  });

  describe('find something', () => {
    let commonSymbol: ts.Symbol;
    let referencedNode: ts.Node;

    function newNodeWithConnection(nodes?: ts.Node[]) {
      return createNode({symbol: commonSymbol, nodes});
    }

    function newNode(nodes?: ts.Node[]) {
      return createNode({nodes});
    }

    beforeEach(() => {
      commonSymbol = newSymbol();
      referencedNode = newNodeWithConnection();
    });

    test('should find one connection', () => {
      const nodeWithConnection = newNodeWithNewSymbol([
        newNodeWithConnection(),
      ]);

      const items: Item[] = [
        new Item(nodeWithConnection),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one connection from 3 level', () => {
      const nodeWithConnection = newNodeWithNewSymbol([
        newNode([newNodeWithConnection()]),
      ]);

      const items: Item[] = [
        new Item(nodeWithConnection),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find one connection from 4 level', () => {
      const nodeWithConnection = newNodeWithNewSymbol([
        newNode([newNode([newNodeWithConnection()])]),
      ]);

      const items: Item[] = [
        new Item(nodeWithConnection),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(1);
    });

    test('should find 2 connections from one item in different level', () => {
      const nodeWithConnection = newNodeWithNewSymbol([
        newNode([newNodeWithConnection([newNodeWithConnection()])]),
      ]);

      const items: Item[] = [
        new Item(nodeWithConnection),
        new Item(referencedNode),
      ];
      expect(searcher.search(items)).toHaveLength(2);
    });

    test('should find 3 connections from one item in the same level', () => {
      const nodeWithConnection = newNodeWithNewSymbol([
        createNode({
          nodes: [
            createNode({
              nodes: [
                newNodeWithConnection(),
                newNodeWithConnection(),
                newNodeWithConnection(),
              ],
            }),
          ],
        }),
      ]);

      const items: Item[] = [
        new Item(nodeWithConnection),
        new Item(referencedNode),
      ];

      expect(searcher.search(items)).toHaveLength(3);
    });

    test('should find 2 connections from 2 different items', () => {
      const nodeWithConnection1 = createNode({
        nodes: [newNodeWithConnection()],
        symbol: newSymbol(),
      });

      const nodeWithConnection2 = createNode({
        nodes: [newNodeWithConnection()],
        symbol: newSymbol(),
      });

      const items: Item[] = [
        new Item(nodeWithConnection1),
        new Item(referencedNode),
        new Item(nodeWithConnection2),
      ];

      expect(searcher.search(items)).toHaveLength(2);
    });
  });
});
