import {FoundNode} from '@lib/modules/search/model/FoundNode';
import {Reference} from '@lib/modules/search/model/Reference';
import {createItem} from './createItem';
import {createNodeStubWithChilds} from './createNodeStub';

export function createReference() {
  const nodeForFromItem = createNodeStubWithChilds();
  const reference = new Reference(
    new FoundNode(nodeForFromItem.asNode()),
    createItem()
  );
  reference.fromNode = nodeForFromItem.getChild(0).asNode();
  return reference;
}
