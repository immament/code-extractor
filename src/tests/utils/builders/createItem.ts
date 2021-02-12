import {Item} from 'src/lib/Item';
import {createNodeStub} from './createNodeStub';

export function createItem() {
  return new Item(createNodeStub({}).asNode());
}
