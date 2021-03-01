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
}

const tsPrinter = new TsPrinter({textFragmentLength: 20});

export default tsPrinter;
