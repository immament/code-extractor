import ts from 'typescript';
import {Declaration} from './Declaration';
import {ProgramContext} from './ProgramContext';

export class SymbolIml {
  constructor(private context: ProgramContext, private tsSymbol: ts.Symbol) {}

  get internal() {
    return this.tsSymbol;
  }

  getDeclarations(): Declaration[] {
    return (
      this.tsSymbol
        .getDeclarations()
        ?.map(d => new Declaration(this.context, d)) ?? []
    );
  }

  getExportsOfModule(): SymbolIml[] {
    return this.context.getTypeChecker().getExportsOfModule(this);
  }
}
