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

  get internal() {
    return this.tsNode;
  }

  getFileName(): string {
    return this.tsNode.fileName;
  }

  getExports(): SymbolIml[] {
    const symbol = this.getSymbol();
    if (!symbol) return [];

    const symbols = this.context.getTypeChecker().getExportsOfModule(symbol);
    return symbols;
  }

  getExportsDeclarations(): Declaration[] {
    const exports = this.getExports();
    if (!exports) return [];
    return exports.flatMap(symbol => symbol.getDeclarations());
  }
}
