import ts from 'typescript';
import {HostEnvironment} from '../HostEnvironement';
import {TsConfig, TsConfigError} from '../TsConfig';
import {mockedFn} from '../../tests/utils/mocked';

import {mock, MockProxy} from 'jest-mock-extended';

jest.mock('typescript');

const mockedFindConfigFile = mockedFn(ts.findConfigFile);
const mockedReadConfigFile = mockedFn(ts.readConfigFile);
const mockedParseJsonConfigFileContent = mockedFn(
  ts.parseJsonConfigFileContent
);
const fullTsConfigFilePath = 'basePath/tsConfigFileName.json';
const basePath = 'basePath/';
const tsConfigFileName = 'tsConfigFileName.json';

let mockedHostEnvionment: MockProxy<HostEnvironment>;

let tsConfig: TsConfig;

describe('when config file exists', () => {
  beforeEach(() => {
    // mockedHostEnvionment = mock()
    mockedFindConfigFile.mockReturnValue(fullTsConfigFilePath);
    mockedHostEnvionment = mock<HostEnvironment>();
    tsConfig = new TsConfig(basePath, tsConfigFileName, mockedHostEnvionment);
  });

  test('should isFileExists should return true', () => {
    expect(tsConfig.isFileExists()).toBeTruthy();
  });

  test('should getFullPath should return mocked full path to file', () => {
    expect(tsConfig.getFullPath()).toBe(fullTsConfigFilePath);
  });

  test('should readConfigFile return mocked data', () => {
    const mockedReadConfigResult = {
      config: {compilerOptions: {target: 'ES6'}},
    };
    mockedReadConfigFile.mockReturnValue(mockedReadConfigResult);
    expect(tsConfig.readConfigFile()).toBe(mockedReadConfigResult.config);
  });

  test('should readConfigFile throw exception when result contains error', () => {
    const mockedReadConfigResult: {error?: ts.Diagnostic} = {
      error: {
        messageText: 'Error during read config file',
        category: ts.DiagnosticCategory.Warning,
        code: 1000,
      } as ts.Diagnostic,
    };
    mockedReadConfigFile.mockReturnValue(mockedReadConfigResult);
    expect(() => {
      tsConfig.readConfigFile();
    }).toThrowError(TsConfigError);
  });

  test('should getCompilerOptions return mocked data', () => {
    const mockedReadConfigResult = {
      config: {compilerOptions: {target: 'ES2018'}},
    };
    mockedReadConfigFile.mockReturnValue(mockedReadConfigResult);
    const mockedParseJsonConfigFileContentResult = {
      options: {allowJs: true},
      fileNames: [],
      errors: [],
    };
    mockedParseJsonConfigFileContent.mockReturnValue(
      mockedParseJsonConfigFileContentResult
    );

    expect(tsConfig.getCompilerOptions()).toBe(
      mockedParseJsonConfigFileContentResult.options
    );
  });
});

describe('when config file not exists', () => {
  beforeEach(() => {
    mockedFindConfigFile.mockReturnValue(undefined);
    tsConfig = new TsConfig(basePath, tsConfigFileName, mockedHostEnvionment);
  });

  test('sould isFileExists return false', () => {
    expect(tsConfig.isFileExists()).toBeFalsy();
  });

  test('should readConfigFile should throw exception if config file not found', () => {
    expect(() => {
      tsConfig.readConfigFile();
    }).toThrowError(TsConfigError);
  });
});
