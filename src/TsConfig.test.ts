import ts from 'typescript';
import {TsConfig} from './TsConfig';
import {mocked} from './utils/mocked';

jest.mock('typescript');

const mockedFindConfigFile = mocked(ts.findConfigFile);

describe('ts config file exists', () => {
  let tsConfig: TsConfig;

  beforeEach(() => {
    mockedFindConfigFile.mockReturnValue(true);
    tsConfig = new TsConfig('basePath/', 'tsConfigFileName.json', {
      fileExists: () => true,
    });
  });

  test('create instance ', () => {
    expect(tsConfig).toBeTruthy();
  });

  test('should test files exists', () => {
    expect(tsConfig.isFileExists()).toBeTruthy();
  });

  test('should test files not exists', () => {
    mockedFindConfigFile.mockReturnValue(false);

    expect(tsConfig.isFileExists()).toBeFalsy();
  });
});
