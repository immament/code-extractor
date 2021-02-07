import ts from 'typescript';
import {Item} from './Item';

export class Project {
  searchInFile(sourceFile: ts.SourceFile, kinds: number[]): Item[] {
    return this.searchInNode(sourceFile, kinds);
  }

  private searchInNode(node: ts.Node, kinds: number[]): Item[] {
    const result: Item[] = this.isSearchedKind(kinds, node)
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

  private isSearchedKind(kinds: number[], node: ts.Node) {
    return kinds.includes(node.kind);
  }

  searchInFiles() {
    return;
  }
}
