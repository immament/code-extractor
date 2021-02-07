import ts from 'typescript';
import {NodeStub} from './NodeStub';

export function createTypeChecker(): ts.TypeChecker {
  return (new TypeCheckerStub() as unknown) as ts.TypeChecker;
}

export class TypeCheckerStub {
  getSymbolAtLocation(node: NodeStub): ts.Symbol | undefined {
    if (node.getSymbol) {
      return node.getSymbol();
    }
    // console.log('node.symbol', !!node);
    if (node.symbol) {
      return node.symbol;
    }
    return;
  }
}
