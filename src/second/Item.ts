import ts from 'typescript';

export class Item {
  private kind: number;

  constructor(private node: ts.Node) {
    this.kind = node.kind;
  }

  getNode() {
    return this.node;
  }
}
