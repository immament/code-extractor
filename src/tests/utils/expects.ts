import {Item} from 'src/lib/Item';
import {Reference} from 'src/lib/Reference';
import {referencesToNodeIds, asNodeStub} from './stub-mappers';

export function expectReferences(refernces: Reference[]) {
  return {
    toBeFromItemToItem: (
      items: Item[],
      fromToIds: [fromIndex: number, toIndex: number][]
    ) => {
      expect(referencesToNodeIds(refernces)).toEqual(
        fromToIds.map(([from, to]) => ({
          fromId: asNodeStub(items[from].getNode()).id,
          toId: asNodeStub(items[to].getNode()).id,
        }))
      );
    },
  };
}
