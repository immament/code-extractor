import {TsNode} from './Node';
import {SourceFile} from './SourceFile';
import {SyntaxKind} from './SyntaxKind';

export class TsSourceFile implements SourceFile {
  private kind = SyntaxKind.SourceFile;
  private fileName = 'defaultName';

  constructor(private childs: TsNode[] = []) {}

  getKind(): SyntaxKind {
    return this.kind;
  }

  getFileName(): string {
    return this.fileName;
  }

  forEachChild(nodeCb: (node: TsNode) => void) {
    this.childs.forEach(node => {
      nodeCb(node);
    });
  }
}
