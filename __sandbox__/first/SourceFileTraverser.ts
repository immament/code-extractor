import {TsSourceFile} from './TsSourceFile';

export interface SourceFileTraverser {
  traverse(sourceFile: TsSourceFile): void;
}
