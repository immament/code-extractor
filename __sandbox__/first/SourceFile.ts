import {TsNode} from './Node';
import {SyntaxKind} from './SyntaxKind';

export interface SourceFile {
  getKind(): SyntaxKind;
  getFileName(): string;
  forEachChild(nodeCb: (node: TsNode) => void): void;
}
