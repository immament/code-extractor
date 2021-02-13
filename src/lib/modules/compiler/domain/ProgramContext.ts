import ts from 'typescript';
import {Node} from './Node';
import {Program} from './Program';
import {SourceFile} from './SourceFile';
import {TypeChecker} from './TypeChecker';

export class ProgramContext {
  readonly #nodeCache = new WeakMap<ts.Node, Node>();

  constructor(private program: Program) {}

  getTypeChecker(): TypeChecker {
    return this.program.getTypeChecker();
  }

  getNodeOrCreate<T extends Node>(tsNode: ts.Node): T {
    return (this.#nodeCache.get(tsNode) as T) ?? (this.createNode(tsNode) as T);
  }

  private createNode(tsNode: ts.Node) {
    let node: Node;
    if (tsNode.kind === ts.SyntaxKind.SourceFile) {
      node = new SourceFile(this, tsNode as ts.SourceFile);
    } else {
      node = new Node(this, tsNode);
    }
    this.#nodeCache.set(tsNode, node);
    return node;
  }
}
