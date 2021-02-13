import {ReferenceSearcherError} from '../ReferenceSearcher';
import {ReferenceSearcherContext} from '../ReferenceSearcherContext';
import {FoundNode} from '../model/FoundNode';
import {createTsTypeChecker} from '@tests/stubs/TypeCheckerStub';
import {TypeChecker} from '../../compiler/domain/TypeChecker';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';

describe('ReferenceSearcherContext', () => {
  test('should throw exception when addResult without context items set', () => {
    const context = new ReferenceSearcherContext(
      new TypeChecker({} as ProgramContext, createTsTypeChecker()),
      []
    );
    expect(() => context.addReference({} as FoundNode)).toThrow(
      ReferenceSearcherError
    );
  });
});
