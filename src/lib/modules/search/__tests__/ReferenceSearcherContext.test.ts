import {FoundNode} from '../model/FoundNode';
import {ReferenceSearcherError} from '../ReferenceSearcher';
import {ReferenceSearcherContext} from '../ReferenceSearcherContext';

describe('ReferenceSearcherContext', () => {
  test('should throw exception when addResult before set current item', () => {
    const context = new ReferenceSearcherContext([]);
    expect(() => context.addReference({} as FoundNode)).toThrow(
      ReferenceSearcherError
    );
  });
});
