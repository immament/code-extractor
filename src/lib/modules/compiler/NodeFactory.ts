import ts from 'typescript';
import {Node} from './domain/Node';
import {ProgramContext} from './domain/ProgramContext';
import {SourceFile} from './domain/SourceFile';

export class NodeFactory {
  constructor(private contex: ProgramContext) {}

  create(tsNode: ts.Node): Node {
    let node: Node;
    if (tsNode.kind === ts.SyntaxKind.SourceFile) {
      node = new SourceFile(this.contex, tsNode as ts.SourceFile);
    } else {
      node = new Node(this.contex, tsNode);
    }
    return node;
  }
}
