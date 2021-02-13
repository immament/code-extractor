import {FoundNode} from '@lib/modules/search/model/FoundNode';
import {createNodeStub} from './createNodeStub';

export function createItem() {
  return new FoundNode(createNodeStub({}).asNode());
}
