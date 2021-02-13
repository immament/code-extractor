import {Node} from '@lib/modules/compiler/domain/Node';
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

  printNodeWithoutChilds(
    node: ts.Node,
    {level = 0}: Partial<PrintNodeOptions> = {}
  ) {
    return (
      this.printer.indent(level) +
      ts.SyntaxKind[node.kind] +
      this.textFragment(node)
    );
  }

  printNodeSourceFileName(node: Node) {
    return this.colors.code(node.getSourceFile()?.getFileName());
  }

  printNode(node: ts.Node, {level = 0, cb}: Partial<PrintNodeOptions> = {}) {
    return this.printer.join(this.printNodeAsArray(node, {level, cb}));
  }

  private printNodeAsArray(node: ts.Node, {level, cb}: PrintNodeOptions) {
    return [
      this.printNodeWithoutChilds(node, {level}) + this.printCallback(node, cb),
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
      result.push(this.printNode(child, {level: level + 1, cb: cb}));
    });
    return result;
  }
}
