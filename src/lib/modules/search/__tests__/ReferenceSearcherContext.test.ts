import {
  ReferenceSearcherContext,
  ReferenceSearcherError,
} from '../ReferenceSearcher';
import {FoundNode} from '../model/FoundNode';
import {createTsTypeChecker} from '@tests/stubs/TypeCheckerStub';
import {TypeChecker} from '../../compiler/domain/TypeChecker';

describe('ReferenceSearcherContext', () => {
  test('should throw exception when addResult without context items set', () => {
    const context = new ReferenceSearcherContext(
      new TypeChecker(createTsTypeChecker()),
      []
    );
    expect(() => context.addReference({} as FoundNode)).toThrow(
      ReferenceSearcherError
    );
  });
});
