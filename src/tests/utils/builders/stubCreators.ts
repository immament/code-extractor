import {Item} from '@lib/Item';
import {Reference} from '@lib/Reference';
import {createItem} from './createItem';
import {createNodeStubWithChilds} from './createNodeStub';

export function createReference() {
  const nodeForFromItem = createNodeStubWithChilds();
  const reference = new Reference(
    new Item(nodeForFromItem.asNode()),
    createItem()
  );
  reference.fromNode = nodeForFromItem.getChild(0).asNode();
  return reference;
}
