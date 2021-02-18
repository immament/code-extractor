import ts from 'typescript';
import {ProgramContext} from './ProgramContext';

export class Type {
  constructor(private context: ProgramContext, private tsType: ts.Type) {}

  getSymbol() {
    const tsSymbol = this.tsType.getSymbol();

    return (
      tsSymbol && this.context.getTypeChecker().getOrCreateSymbol(tsSymbol)
    );
  }
}
