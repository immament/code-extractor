import {Node} from '../compiler/domain/Node';
import {FoundNodeCache} from './FoundNodeCache';
import {FoundNode} from './model/FoundNode';
import {Reference, ReferenceType} from './model/Reference';
import {ReferenceSearcherError} from './ReferenceSearcher';

export class ReferenceSearcherContext {
  #currentFoundNode?: FoundNode;
  private result: Reference[] = [];
  private itemCache: FoundNodeCache;

  private get contextFoundNode() {
    if (!this.#currentFoundNode) {
      throw new ReferenceSearcherError('Context Found Node not set');
    }
    return this.#currentFoundNode;
  }

  constructor(items: FoundNode[]) {
    this.itemCache = new FoundNodeCache(items);
  }

  setCurrentFoundNode(item: FoundNode) {
    this.#currentFoundNode = item;
  }

  getResult() {
    return this.result;
  }

  addReference(item: FoundNode, fromNode?: Node, type: ReferenceType = 'Use') {
    const reference = new Reference(this.contextFoundNode, item, type);
    reference.fromNode = fromNode;
    this.addResultIfnNotContains(reference);
  }

  addResultIfnNotContains(reference: Reference) {
    // TODO:
    this.result.push(reference);
    // if (this.result.every(r => !reference.equalTo(r))) {
    //   this.result.push(reference);
    // }
  }

  hasItemsToFound() {
    return this.itemCache.hasItemsToFound();
  }

  addIfIsConncetedItem(node: Node, type: ReferenceType) {
    const connectedItem = this.searchConnectedItem(node);
    if (connectedItem) {
      this.addReference(connectedItem, node, type);
    }
  }

  searchConnectedItem(node: Node): FoundNode | undefined {
    const item = this.itemCache.getItemForNode(node);
    if (item && !this.isCurrentFoundNode(item)) return item;
    return;
  }

  private isCurrentFoundNode(item: FoundNode): boolean {
    return item.getNode() === this.contextFoundNode.getNode();
  }
}
