export interface HostEnvironment {
  fileExists: (filePath: string) => boolean;
  readFile: (path: string) => string | undefined;
  useCaseSensitiveFileNames: boolean;
  readDirectory(
    rootDir: string,
    extensions: readonly string[],
    excludes: readonly string[] | undefined,
    includes: readonly string[],
    depth?: number
  ): readonly string[];
}
