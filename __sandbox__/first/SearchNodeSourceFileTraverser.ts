import {FoundNode} from './FoundNode';
import {TsNode} from './Node';
import {NodeFilter} from './NodeFilter';
import {TsSourceFile} from './TsSourceFile';
import {SourceFileTraverser} from './SourceFileTraverser';
import {SyntaxKind} from './SyntaxKind';

export class NodeSearcherSourceFileTraverser implements SourceFileTraverser {
  private _visitedFilesCount = 0;
  private foundNodes: FoundNode[] = [];

  get visitedFilesCount() {
    return this._visitedFilesCount;
  }

  constructor(private nodeFilters: Partial<Record<SyntaxKind, NodeFilter>>) {}

  traverse(sourceFile: TsSourceFile): void {
    sourceFile.forEachChild(node => {
      this.filterNode(node);
    });
    this._visitedFilesCount++;
  }

  private getFilter(kind: SyntaxKind): NodeFilter | undefined {
    return this.nodeFilters && this.nodeFilters[kind];
  }

  private filterNode(node: TsNode) {
    const filter = this.getFilter(node.getKind());
    if (filter) {
      const foundNode = filter.filter(node);
      if (foundNode) this.foundNodes.push(foundNode);
    }
    node.forEachChild(child => this.filterNode(child));
  }

  getFoundNodes(): FoundNode[] {
    return [...this.foundNodes];
  }
}
