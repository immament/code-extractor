import {Node} from '@imm/ts-common/src/lib/modules/compiler/domain/Node';
import {ProgramContext} from '@imm/ts-common/src/lib/modules/compiler/domain/ProgramContext';
import {SourceFile} from '@imm/ts-common/src/lib/modules/compiler/domain/SourceFile';
import {FoundNode} from './model/FoundNode';

export class NodeSearcher {
  constructor(private context: ProgramContext) {}

  searchInFiles(sourceFiles: readonly SourceFile[], kinds: number[]) {
    return sourceFiles.flatMap(sf => this.searchInFile(sf, kinds));
  }

  searchInFile(sourceFile: SourceFile, kinds: number[]): FoundNode[] {
    return this.searchInNode(sourceFile, kinds);
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
      .map(d => this.createItem(d));

    return items;
  }

  private searchInNode(node: Node, kinds: number[]): FoundNode[] {
    const result: FoundNode[] = this.isSearchedNode(kinds, node)
      ? [this.createItem(node)]
      : [];

    node.forEachChild(child => {
      result.push(...this.searchInNode(child, kinds));
      return undefined;
    });
    return result;
  }

  private createItem(node: Node): FoundNode {
    return new FoundNode(node);
  }

  private isSearchedNode(kinds: number[], node: Node) {
    return kinds.includes(node.kind);
  }
}
