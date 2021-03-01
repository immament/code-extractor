import {
  createInMemoryCompilerHost,
  InMemoryFile,
} from 'src/tests-common/utils/builders/createInMemoryCompilerHost';

describe('createInMemoryCompilerHost', () => {
  test('should throw file name error', () => {
    const files: InMemoryFile[] = [['file.ts', '']];
    expect(() => createInMemoryCompilerHost(files)).toThrow(
      'Every file name have to starts with "/"'
    );
  });
});
