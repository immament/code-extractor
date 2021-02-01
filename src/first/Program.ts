import {SourceFile} from './SourceFile';
import {TypeChecker} from './TypeChecker';

export interface Program {
  getTypeChecker(): TypeChecker;
  getSourceFiles(): SourceFile[];
}
