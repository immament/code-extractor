import {Node} from '@lib/modules/compiler/domain/Node';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import ts from 'typescript';
import {Colors} from './colors';
import {TsPrinter, TsPrinterOptions} from './TsPrinter';

export type PrintNodeCallback = (
  node: ts.Node,
  printer: TsPrinter
) => string | undefined;

export type PrintNodeOptions = {level: number; cb?: PrintNodeCallback};

export class NodePrinter {
  colors: Colors;

  constructor(private options: TsPrinterOptions, private printer: TsPrinter) {
    this.colors = options.colors;
  }

  printWithoutChilds(
    node: ts.Node,
    {level = 0}: Partial<PrintNodeOptions> = {}
  ) {
    return (
      this.printer.indent(level) + NodeKind[node.kind] + this.textFragment(node)
    );
  }

  printSourceFileName(node: Node) {
    return this.colors.code(node.getSourceFile()?.getFileName());
  }

  print(node: ts.Node, {level = 0, cb}: Partial<PrintNodeOptions> = {}) {
    return this.printer.join(this.printNodeAsArray(node, {level, cb}));
  }

  prepare(node?: ts.Node) {
    return prepareToPrint(node);
  }

  prepareArray(nodes?: ts.Node[]) {
    return nodes?.map(n => prepareToPrint(n));
  }

  private printNodeAsArray(node: ts.Node, {level, cb}: PrintNodeOptions) {
    return [
      this.printWithoutChilds(node, {level}) + this.printCallback(node, cb),
      ...this.printNodeChildsToArray(node, {level, cb}),
    ];
  }

  private printCallback(node: ts.Node, cb?: PrintNodeCallback) {
    const result = cb?.(node, this.printer);
    return result ? ' ' + result : '';
  }

  private textFragment(node: ts.Node) {
    return this.options.textFragmentLength
      ? ' ' +
          this.options.colors.code(
            node.getText().substr(0, this.options.textFragmentLength)
          )
      : '';
  }

  private printNodeChildsToArray(node: ts.Node, {level, cb}: PrintNodeOptions) {
    const result: string[] = [];
    node.forEachChild(child => {
      result.push(this.print(child, {level: level + 1, cb: cb}));
    });
    return result;
  }
}

// TODO: refeactor vvvvvv

function syntaxKindText(element: {kind: NodeKind}): string {
  return NodeKind[element.kind];
}

function createNodeObj(node: object): {[key: string]: unknown} {
  const anyNode = node as {kind: NodeKind};
  return anyNode.kind
    ? {kindText: `${syntaxKindText(anyNode) || ''} (${anyNode.kind})`}
    : {};
}

export function printObject(
  object: object | undefined,
  ignoreKeysArg?: string[]
) {
  console.log(prepareToPrint(object, ignoreKeysArg));
}

export function prepareToPrintArray(
  objects?: object[],
  ignoreKeysArg?: string[]
) {
  return objects?.map(o => prepareToPrint(o, ignoreKeysArg));
}

export function prepareToPrint(
  node: object | undefined,
  ignoreKeysArg?: string[]
): unknown {
  if (!node) {
    return;
  }

  const ignoreKeys = ignoreKeysArg
    ? ignoreKeysArg
    : [
        'parent',
        'pos',
        'end',
        'flags',
        'modifierFlagsCache',
        'transformFlags',
        'flowNode',
        'kind',
        'checker',
        //'heritageClauses',
      ];

  const refs: object[] = [];

  function prepare(node: object, level = 0): unknown {
    if (refs.includes(node)) {
      const anyNode = node as {id: string; kind: number};
      return `circular [${anyNode.id || ''}/${anyNode.kind || ''}]`;
    }
    refs.push(node);

    const reduced = Object.entries(node)
      .filter(([key]) => !ignoreKeys.includes(key))
      .reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          value = value.map(v => prepare(v, level + 1));
        } else if (typeof value === 'object') {
          value = prepare(value, level + 1);
        } else if (key === 'token') {
          value = NodeKind[value];
        }

        if (value) {
          acc[key] = value;
        }
        return acc;
      }, createNodeObj(node));
    return reduced;
  }

  return prepare(node);
}
