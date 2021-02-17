import * as NodeSearcherImport from '../NodeSearcher';
import * as NodeSearcherMockImport from '../__mocks__/NodeSearcher';

export const {
  mockSearchExportedDeclarationsInFiles,
} = (NodeSearcherImport as unknown) as typeof NodeSearcherMockImport;
