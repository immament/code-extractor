import ts from 'typescript';

export function createSourceFile(
  fileName: string,
  sourceText: string,
  languageVersion: ts.ScriptTarget = ts.ScriptTarget.ES2018
) {
  return ts.createSourceFile(
    fileName,
    sourceText,
    languageVersion,
    true,
    ts.ScriptKind.TS
  );
}
