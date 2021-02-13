import ts from 'typescript';

export class FoundNode {
  private kind: number;

  constructor(private node: ts.Node) {
    this.kind = node.kind;
  }

  getNode() {
    return this.node;
  }
}
