import {
  ReferenceSearcherContext,
  ReferenceSearcherError,
} from '../ReferenceSearcher';
import {Item} from '../Item';
import {createTypeChecker} from '../../tests/stubs/TypeCheckerStub';

describe('ReferenceSearcherContext', () => {
  test('should throw exception when addResult without context items set', () => {
    const context = new ReferenceSearcherContext(createTypeChecker(), []);
    expect(() => context.addReference({} as Item)).toThrow(
      ReferenceSearcherError
    );
  });
});
