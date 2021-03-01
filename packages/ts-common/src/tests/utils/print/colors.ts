import chalk from 'chalk';

type Styles = 'header' | 'code';

export type Colors = Record<Styles, (...text: unknown[]) => string>;

export const colors: Colors = {
  header: chalk.cyan,
  code: chalk.gray,
};

const dummyMethod: (...text: unknown[]) => string = (...text) =>
  text.map(t => t).join(' ') as string;

export const dummyColors: Colors = {
  header: dummyMethod,
  code: dummyMethod,
};
