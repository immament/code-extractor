import {Node} from '../compiler/domain/Node';
import {TypeChecker} from '../compiler/domain/TypeChecker';
import {FoundNodeCache} from './FoundNodeCache';
import {FoundNode} from './model/FoundNode';
import {Reference} from './model/Reference';
import {ReferenceSearcherError} from './ReferenceSearcher';

export class ReferenceSearcherContext {
  #contextFoundNode?: FoundNode;
  private result: Reference[] = [];
  private itemCache: FoundNodeCache;

  private get contextFoundNode() {
    if (!this.#contextFoundNode) {
      throw new ReferenceSearcherError('Context Found Node not set');
    }
    return this.#contextFoundNode;
  }

  constructor(typeChecker: TypeChecker, items: FoundNode[]) {
    this.itemCache = new FoundNodeCache(items);
  }

  setContextFoundNode(item: FoundNode) {
    this.#contextFoundNode = item;
  }

  getResult() {
    return this.result;
  }

  addReference(item: FoundNode, fromNode?: Node) {
    const reference = new Reference(this.contextFoundNode, item);
    reference.fromNode = fromNode;
    this.result.push(reference);
  }

  hasItemsToFound() {
    return this.itemCache.hasItemsToFound();
  }

  getConnectedItem(node: Node): FoundNode | undefined {
    const item = this.itemCache.getItemForNode(node);
    if (item && !this.isContextItem(item)) return item;
    return;
  }

  private isContextItem(item: FoundNode): boolean {
    return item.getNode() === this.contextFoundNode.getNode();
  }
}