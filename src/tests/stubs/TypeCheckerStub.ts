import ts from 'typescript';
import {NodeStub} from './NodeStub';

export function createTsTypeChecker(): ts.TypeChecker {
  return (new TypeCheckerStub() as unknown) as ts.TypeChecker;
}

export class TypeCheckerStub {
  getSymbolAtLocation(node: NodeStub): ts.Symbol | undefined {
    return node.getSymbol();
  }
}
