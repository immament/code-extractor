import {Program} from '@lib/modules/compiler/domain/Program';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';

export function createProgramContextStub(program?: Program) {
  program ??= {} as Program;
  return new ProgramContext(program);
}
