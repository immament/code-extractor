import ts from 'typescript';
import {Node} from '../compiler/domain/Node';
import {ProgramContext} from '../compiler/domain/ProgramContext';
import {SourceFile} from '../compiler/domain/SourceFile';

import {FoundNode} from './model/FoundNode';

// TODO: replace ts.SourceFile to SourceFile in file
export class NodeSearcher {
  constructor(private context: ProgramContext) {}

  searchInFile(sourceFile: ts.SourceFile, kinds: number[]): FoundNode[] {
    return this.searchInNode(sourceFile, kinds);
  }

  searchInFiles(sourceFiles: readonly ts.SourceFile[], kinds: number[]) {
    return sourceFiles.flatMap(sf => this.searchInFile(sf, kinds));
  }

  searchExportedDeclarationsInFiles(
    sourceFiles: readonly SourceFile[],
    kinds: number[]
  ): FoundNode[] {
    return sourceFiles.flatMap(sf =>
      this.searchExportedDeclarations(sf, kinds)
    );
  }

  searchExportedDeclarations(
    sourceFile: SourceFile,
    kinds: number[]
  ): FoundNode[] {
    const items = sourceFile
      .getExportsDeclarations()
      .filter(d => this.isSearchedNode(kinds, d))
      .map(d => this.createItem(d.internal));

    return items;
  }

  private searchInNode(node: ts.Node, kinds: number[]): FoundNode[] {
    const result: FoundNode[] = this.isSearchedTsNode(kinds, node)
      ? [this.createItem(node)]
      : [];

    node.forEachChild(child => {
      result.push(...this.searchInNode(child, kinds));
    });
    return result;
  }

  private createItem(node: ts.Node): FoundNode {
    return new FoundNode(node, new Node(this.context, node));
  }

  private isSearchedNode(kinds: number[], node: Node) {
    return kinds.includes(node.kind);
  }

  private isSearchedTsNode(kinds: number[], node: ts.Node) {
    return kinds.includes(node.kind);
  }
}
