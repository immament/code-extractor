import ts from 'typescript';
import {Declaration} from './Declaration';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';
import {SymbolIml} from './SymbolIml';

export class SourceFile extends Node {
  protected tsNode: ts.SourceFile;

  constructor(context: ProgramContext, tsSourceFile: ts.SourceFile) {
    super(context, tsSourceFile);
    this.tsNode = tsSourceFile;
  }

  get internal(): ts.SourceFile {
    return this.tsNode;
  }

  getFileName(): string {
    return this.tsNode.fileName;
  }

  getExports(): SymbolIml[] {
    const symbol = this.getSymbol();
    /* istanbul ignore next*/
    if (!symbol) throw Error('SourceFile should always have a symbol');

    return this.context.getTypeChecker().getExportsOfModule(symbol);
  }

  getExportsDeclarations(): Declaration[] {
    return this.getExports().flatMap(symbol => symbol.getDeclarations());
  }

  getSourceFile(): SourceFile {
    return this;
  }
}
