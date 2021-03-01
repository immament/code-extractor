import {mockFn} from '@imm/ts-common/src/tests/utils/jest-utils';
import * as real from '../ReferenceSearcher';

export const mockReferenceSearch = mockFn<
  typeof real.ReferenceSearcher.prototype.search
>();

export const ReferenceSearcher = jest
  .fn<Partial<real.ReferenceSearcher>, []>()
  .mockImplementation(() => ({
    search: mockReferenceSearch,
  }));
