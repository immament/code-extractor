import ts from 'typescript';
import {SyntaxKind} from './SyntaxKind';

export interface Node {
  getKind(): SyntaxKind;
  forEachChild(nodeCb: (node: TsNode) => void): void;
}

export class TsNode implements Node {
  constructor(private _tsNode: ts.Node) {}

  get tsNode() {
    return this._tsNode;
  }

  getKind(): SyntaxKind {
    return this._tsNode.kind;
  }

  forEachChild(nodeCb: (node: TsNode) => void) {
    this._tsNode.forEachChild(tsNode => {
      nodeCb(new TsNode(tsNode));
    });
  }
}
