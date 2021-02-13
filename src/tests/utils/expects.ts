import {FoundNode} from '@lib/modules/search/model/FoundNode';
import {Reference} from '@lib/modules/search/model/Reference';
import {referencesToNodeIds, asNodeStub} from './stub-mappers';

export function expectReferences(refernces: Reference[]) {
  return {
    toBeFromItemToItem: (
      items: FoundNode[],
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
