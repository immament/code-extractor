import {FoundNode} from '@lib/modules/search/model/FoundNode';
import {Reference} from '@lib/modules/search/model/Reference';
import {pick} from '../type-utils';
import {Colors, colors, dummyColors} from './colors';
import {NodePrinter} from './NodePrinter';

interface TsPrinterArgs {
  useColors?: boolean;
  textFragmentLength?: number;
  joinLineCharacter?: string;
}

export interface TsPrinterOptions {
  colors: Colors;
  textFragmentLength: number;
  joinLineCharacter: string;
}

const defaultTsPrinterOptions: TsPrinterOptions = {
  colors: colors,
  textFragmentLength: 0,
  joinLineCharacter: '\n',
};

export class TsPrinter {
  options: TsPrinterOptions;
  colors: Colors;
  private readonly _nodePrinter: NodePrinter;

  get nodePrinter() {
    return this._nodePrinter;
  }

  constructor(options: TsPrinterArgs = {}) {
    this.options = this.initOptions(options);
    this.colors = this.options.colors;
    this._nodePrinter = new NodePrinter(this.options, this);
  }

  printReferences(references: Reference[]) {
    return this.join(references.map(r => this.printReference(r)));
  }

  printItemAsArray = (item: FoundNode) => {
    return [
      this.colors.header('Item - fileName:'),
      this._nodePrinter.printSourceFileName(item.getNode()),
      this.options.joinLineCharacter,
      this._nodePrinter.printWithoutChilds(item.getTsNode()),
      this.options.joinLineCharacter,
    ];
  };

  join(lines: string[]) {
    return lines.join(this.options.joinLineCharacter);
  }

  indent(level: number) {
    return ' '.repeat(level);
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

  private initColors(useColors: boolean) {
    return useColors ? colors : dummyColors;
  }

  private printReference(ref: Reference): string {
    const indentLevel = 2;
    return this.join([
      this.printReferenceFromNode(ref),
      this.colors.header('FROM:'),
      this.nodePrinter.print(ref.from.getTsNode(), {level: indentLevel}),
      this.colors.header('TO:'),
      this.nodePrinter.print(ref.to.getTsNode(), {level: indentLevel}),
    ]);
  }

  private printReferenceFromNode(r: Reference): string {
    return (
      (r.fromNode &&
        this.colors.header('From node: ') +
          this.nodePrinter.printWithoutChilds(r.fromNode.internal)) ??
      ''
    );
  }
}

const tsPrinter = new TsPrinter({textFragmentLength: 20});

export default tsPrinter;