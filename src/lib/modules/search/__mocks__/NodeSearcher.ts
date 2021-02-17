import * as real from '../NodeSearcher';

export const mockSearchExportedDeclarationsInFiles = jest.fn() as jest.MockedFunction<
  typeof real.NodeSearcher.prototype.searchExportedDeclarationsInFiles
>;

export class NodeSearcher implements Partial<real.NodeSearcher> {
  searchExportedDeclarationsInFiles = mockSearchExportedDeclarationsInFiles;
}
