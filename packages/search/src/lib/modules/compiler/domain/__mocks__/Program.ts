import * as real from '../Program';
import {ProgramContext} from '../ProgramContext';
import {TypeChecker} from '../TypeChecker';

export const Program = jest
  .fn<Partial<real.Program>, []>()
  .mockImplementation(() => ({
    getContext: () => ({} as ProgramContext),
    getSourceFiles: () => [],
    getTypeChecker: () => ({} as TypeChecker),
  }));
