import ts, {isExportDeclaration} from 'typescript';
import {Item} from './Item';
import {Program} from './Program';

export class Project {
  searchInFile(sourceFile: ts.SourceFile, kinds: number[]): Item[] {
    return this.searchInNode(sourceFile, kinds);
  }

  searchInFiles(sourceFiles: readonly ts.SourceFile[], kinds: number[]) {
    return sourceFiles.flatMap(sf => this.searchInFile(sf, kinds));
  }

  searchInFilesExp(
    program: Program,
    sourceFiles: readonly ts.SourceFile[],
    kinds: number[]
  ): Item[] {
    return sourceFiles.flatMap(sf =>
      this.searchExportedDeclarations(program, sf, kinds)
    );
  }

  searchExportedDeclarations(
    program: Program,
    sourceFile: ts.SourceFile,
    kinds: number[]
  ): Item[] {
    const typeChecker = program.tsProgram.getTypeChecker();
    const moduleSymbol = typeChecker.getSymbolAtLocation(sourceFile)!;

    const symbols = typeChecker.getExportsOfModule(moduleSymbol);
    const items = symbols
      .flatMap(symbol => {
        const declarations = symbol.getDeclarations();
        return declarations?.filter(d => this.isSearchedNode(kinds, d));
      })
      .filter(d => !!d)
      .map(d => this.createItem(d!));

    return items;
  }

  private searchInNode(node: ts.Node, kinds: number[]): Item[] {
    const result: Item[] = this.isSearchedNode(kinds, node)
      ? [this.createItem(node)]
      : [];

    node.forEachChild(child => {
      result.push(...this.searchInNode(child, kinds));
    });
    return result;
  }

  private createItem(node: ts.Node): Item {
    return new Item(node);
  }

  private isSearchedNode(kinds: number[], node: ts.Node) {
    return kinds.includes(node.kind);
  }
}
