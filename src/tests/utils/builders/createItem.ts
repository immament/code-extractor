import {FoundNode} from '@lib/modules/search/model/FoundNode';
import {createTsNodeStub} from './createNodeStub';

export function createItem() {
  return new FoundNode(createTsNodeStub({}).asNode());
}
