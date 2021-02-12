import {EOL} from 'os';
import {Reference} from 'src/lib/Reference';
import ts from 'typescript';
import {colors, Colors, dummyColors} from './colors';
import {pick} from './pick';

interface TsPrinterArgs {
  useColors?: boolean;
  textFragmentLength?: number;
  joinLineCharacter?: string;
}

interface TsPrinterOptions {
  colors: Colors;
  textFragmentLength: number;
  joinLineCharacter: string;
}

const defaultTsPrinterOptions: TsPrinterOptions = {
  colors: colors,
  textFragmentLength: 0,
  joinLineCharacter: EOL,
};

//const result = pick(sizeOption, "weight", "height", "unit");

export class TsPrinter {
  options: TsPrinterOptions;

  constructor(options: TsPrinterArgs = {}) {
    this.options = this.initOptions(options);
  }

  private initOptions(args: TsPrinterArgs): TsPrinterOptions {
    const optionsFromArgs = pick(
      args,
      'textFragmentLength',
      'joinLineCharacter'
    );
    return {
      ...defaultTsPrinterOptions,
      ...optionsFromArgs,
      colors: this.initColors(args.useColors ?? true),
    };
  }

  printReferences(references: Reference[]) {
    return this.join(references.map(r => this.printReference(r)));
  }

  printNode(node: ts.Node, level = 0) {
    return this.join(this.printNodeAsArray(node, level));
  }

  printNodeWithoutChilds(node: ts.Node, level = 0) {
    return (
      this.indent(level) + ts.SyntaxKind[node.kind] + this.textFragment(node)
    );
  }

  private join(lines: string[]) {
    return lines.join(this.options.joinLineCharacter);
  }

  private printNodeAsArray(node: ts.Node, level = 0) {
    return [
      this.printNodeWithoutChilds(node, level),
      ...this.printNodeChildsToArray(node, level),
    ];
  }

  private printNodeChildsToArray(node: ts.Node, level = 0) {
    const result: string[] = [];
    node.forEachChild(child => {
      result.push(this.printNode(child, level + 1));
    });
    return result;
  }

  private initColors(useColors: boolean) {
    return useColors ? colors : dummyColors;
  }

  private indent(level: number) {
    return ' '.repeat(level);
  }

  private textFragment(node: ts.Node) {
    return this.options.textFragmentLength
      ? ' ' +
          this.options.colors.code(
            node.getText().substr(0, this.options.textFragmentLength)
          )
      : '';
  }

  private printReference(ref: Reference): string {
    const indentLevel = 2;
    return this.join([
      this.printReferenceFromNode(ref),
      this.options.colors.header('FROM:'),
      this.printNode(ref.from.getNode(), indentLevel),
      this.options.colors.header('TO:'),
      this.printNode(ref.to.getNode(), indentLevel),
    ]);
  }

  private printReferenceFromNode(r: Reference): string {
    return (
      (r.fromNode &&
        this.options.colors.header('From node: ') +
          this.printNodeWithoutChilds(r.fromNode)) ??
      ''
    );
  }
}

const tsPrinter = new TsPrinter({textFragmentLength: 20});

export default tsPrinter;
