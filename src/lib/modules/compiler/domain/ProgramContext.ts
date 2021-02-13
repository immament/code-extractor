import {Program} from './Program';
import {TypeChecker} from './TypeChecker';

export class ProgramContext {
  constructor(private program: Program) {}

  getTypeChecker(): TypeChecker {
    return this.program.getTypeChecker();
  }
}
