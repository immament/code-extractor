import {
  ReferenceSearcherContext,
  ReferenceSearcherError,
} from '../ReferenceSearcher';
import {Item} from '../Item';
import {createTsTypeChecker} from '@tests/stubs/TypeCheckerStub';
import {TypeChecker} from '../TypeChecker';

describe('ReferenceSearcherContext', () => {
  test('should throw exception when addResult without context items set', () => {
    const context = new ReferenceSearcherContext(
      new TypeChecker(createTsTypeChecker()),
      []
    );
    expect(() => context.addReference({} as Item)).toThrow(
      ReferenceSearcherError
    );
  });
});
