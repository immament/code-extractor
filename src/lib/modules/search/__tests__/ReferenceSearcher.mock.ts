import * as real from '../ReferenceSearcher';
import * as mock from '../__mocks__/ReferenceSearcher';

export const {mockReferenceSearch} = (real as unknown) as typeof mock;
