import {Cache} from '@lib/common/Cache';
import ts from 'typescript';
import {NodeFactory} from '../NodeFactory';
import {Node} from './Node';
import {Program} from './Program';
import {TypeChecker} from './TypeChecker';

export class ProgramContext {
  readonly #nodeCache = new Cache<ts.Node, Node>();

  private nodeFactory: NodeFactory;

  constructor(private program: Program) {
    this.nodeFactory = new NodeFactory(this);
  }

  getTypeChecker(): TypeChecker {
    return this.program.getTypeChecker();
  }

  getNodeOrCreate<T extends Node>(tsNode: ts.Node): T {
    return this.#nodeCache.getOrCreate(tsNode, this.getNodeFactory()) as T;
  }

  private getNodeFactory() {
    return (tsNode: ts.Node) => this.nodeFactory.create(tsNode);
  }
}
