import ts from 'typescript';
import {Program} from '../compiler/domain/Program';

import {FoundNode} from './model/FoundNode';

export class Project {
  searchInFile(sourceFile: ts.SourceFile, kinds: number[]): FoundNode[] {
    return this.searchInNode(sourceFile, kinds);
  }

  searchInFiles(sourceFiles: readonly ts.SourceFile[], kinds: number[]) {
    return sourceFiles.flatMap(sf => this.searchInFile(sf, kinds));
  }

  searchInFilesExp(
    program: Program,
    sourceFiles: readonly ts.SourceFile[],
    kinds: number[]
  ): FoundNode[] {
    return sourceFiles.flatMap(sf =>
      this.searchExportedDeclarations(program, sf, kinds)
    );
  }

  searchExportedDeclarations(
    program: Program,
    sourceFile: ts.SourceFile,
    kinds: number[]
  ): FoundNode[] {
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

  private searchInNode(node: ts.Node, kinds: number[]): FoundNode[] {
    const result: FoundNode[] = this.isSearchedNode(kinds, node)
      ? [this.createItem(node)]
      : [];

    node.forEachChild(child => {
      result.push(...this.searchInNode(child, kinds));
    });
    return result;
  }

  private createItem(node: ts.Node): FoundNode {
    return new FoundNode(node);
  }

  private isSearchedNode(kinds: number[], node: ts.Node) {
    return kinds.includes(node.kind);
  }
}
