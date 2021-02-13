import {Node} from '@lib/modules/compiler/domain/Node';
import ts from 'typescript';

export class FoundNode {
  private kind: number;

  constructor(private node: ts.Node, private _node?: Node) {
    this.kind = node.kind;
  }

  getTsNode() {
    return this.node;
  }

  getNode() {
    return this._node!;
  }
}
