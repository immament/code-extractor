import {Item} from 'src/lib/Item';
import {Reference} from 'src/lib/Reference';
import {referencesToNodeIds, toNodeStub} from './stub-mappers';

export function expectReferences(refernces: Reference[]) {
  return {
    toBeFromItemToItem: (
      items: Item[],
      fromToIds: [fromIndex: number, toIndex: number][]
    ) => {
      expect(referencesToNodeIds(refernces)).toEqual(
        fromToIds.map(([from, to]) => ({
          fromId: toNodeStub(items[from].getNode()).id,
          toId: toNodeStub(items[to].getNode()).id,
        }))
      );
    },
  };
}
