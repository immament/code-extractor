import {Node} from '@lib/modules/compiler/domain/Node';
export class FoundNode {
  private kind: number;

  constructor(private node: Node) {
    this.kind = node.kind;
  }

  getTsNode() {
    return this.node.internal;
  }

  getNode() {
    return this.node!;
  }
}
