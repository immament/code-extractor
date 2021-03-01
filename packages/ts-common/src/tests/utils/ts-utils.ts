import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import ts from 'typescript';

export function isNodeExported(node: ts.Node): boolean {
  return hasExportFlag(node) || isSourceFile(node);
}

function hasExportFlag(node: ts.Node) {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) &
      ts.ModifierFlags.Export) !==
    0
  );
}

function isSourceFile(node: ts.Node) {
  return !!node.parent && node.parent.kind === NodeKind.SourceFile;
}
