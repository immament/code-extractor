import ts from 'typescript';
import {Program} from './Program';
import {TypeChecker} from './TypeChecker';

export class Context {
  private readonly typeChecker: TypeChecker;

  constructor(program: Program) {
    this.typeChecker = program.getTypeChecker();
  }

  getTypeChecker() {
    return this.typeChecker;
  }
}

export class SourceFile {
  #internal: ts.SourceFile;

  constructor(private context: Context, tsSourceFile: ts.SourceFile) {
    this.#internal = tsSourceFile;
  }

  get internal() {
    return this.#internal;
  }

  getSymbol() {
    return this.context.getTypeChecker().getTsSymbol(this.#internal);
  }

  getExports() {
    const sourceFileSymbol = this.getSymbol();

    if (!sourceFileSymbol) return;

    const symbols = this.context
      .getTypeChecker()
      .getExportsOfModule(sourceFileSymbol);
    return symbols;
  }

  getExportsDeclarations(): ts.Declaration[] {
    const exports = this.getExports();
    if (!exports) return [];
    return exports
      .flatMap(symbol => symbol.getDeclarations())
      .filter<ts.Declaration>(asDeclaration);
  }
}

function asDeclaration(node: ts.Node | undefined): node is ts.Declaration {
  return !!node;
}
