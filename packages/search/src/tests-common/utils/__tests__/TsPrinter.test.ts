import {Program} from '@lib/modules/compiler/domain/Program';
import {ProgramContext} from '@lib/modules/compiler/domain/ProgramContext';
import {NodeKind} from '@lib/modules/compiler/domain/SyntaxKind';
import chalk from 'chalk';
import {NodeStub} from 'src/tests-common/stubs/NodeStub';
import {createFoundNode} from '../../../tests/utils/builders/createFoundNode';
import {createReferenceStub} from '../../../tests/utils/builders/createReferenceStub';
import {createTsNodeStub} from '../builders/createNodeStub';
import {createSourceFile} from '../builders/createSourceFile';
import {PrintNodeCallback} from '../print/NodePrinter';
import {TsPrinter} from '../print/TsPrinter';

describe('TsPrinter with default options', () => {
  let printer: TsPrinter;
  const chalkOrgLevel = chalk.level;
  beforeAll(() => {
    chalk.level = 2;
  });

  afterAll(() => {
    chalk.level = chalkOrgLevel;
  });

  beforeEach(() => {
    printer = new TsPrinter();
  });

  test('should printNode without childs result match snampshot', () => {
    const result = printer.nodePrinter.print(
      new NodeStub({kind: NodeKind.ClassDeclaration}).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should printNodeWithoutChilds result match snampshot', () => {
    const result = printer.nodePrinter.printWithoutChilds(
      new NodeStub({
        kind: NodeKind.ClassDeclaration,
        childs: [new NodeStub({kind: NodeKind.Identifier})],
      }).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should print node with childs', () => {
    const sourceFile = createSourceFile(
      '/index.ts',
      'class MyClass { myMethod() {}}'
    );

    const result = printer.nodePrinter.print(sourceFile);

    expect(result).toMatchSnapshot();
  });

  test('should print references', () => {
    const references = [
      createReferenceWithContext(),
      createReferenceWithContext(),
      createReferenceWithContext(),
    ];
    expect(printer.printReferences(references)).toMatchSnapshot();
  });

  test('should print references without fromNode', () => {
    const reference = createReferenceWithContext();
    reference.fromNode = undefined;
    expect(printer.printReferences([reference])).toMatchSnapshot();
  });
});

describe('TsPrinter with changed options', () => {
  let printer: TsPrinter;

  beforeEach(() => {
    printer = new TsPrinter({
      joinLineCharacter: '-',
      textFragmentLength: 20,
      useColors: false,
    });
  });

  test('should printNode without childs', () => {
    const result = printer.nodePrinter.print(
      new NodeStub({kind: NodeKind.ClassDeclaration}).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should printNodeWithoutChilds', () => {
    const result = printer.nodePrinter.printWithoutChilds(
      new NodeStub({
        kind: NodeKind.ClassDeclaration,
        childs: [createTsNodeStub({kind: NodeKind.Identifier})],
      }).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should print node with childs', () => {
    const sourceFile = createSourceFile(
      '/index.ts',
      'class MyClass { myMethod() {}}'
    );

    const result = printer.nodePrinter.print(sourceFile);

    expect(result).toMatchSnapshot();
  });

  test('should print references', () => {
    const references = [
      createReferenceWithContext(),
      createReferenceWithContext(),
      createReferenceWithContext(),
    ];
    expect(printer.printReferences(references)).toMatchSnapshot();
  });

  test('should print item', () => {
    expect(printer.printItemAsArray(createFoundNode())).toMatchSnapshot();
  });
});

describe('Print node with callback', () => {
  let printer: TsPrinter;

  beforeEach(() => {
    printer = new TsPrinter({
      useColors: false,
    });
  });

  test('should printNode without childs', () => {
    const callback: PrintNodeCallback = (n, p) =>
      p.colors.header(n.kind.toString());

    const node = new NodeStub({
      kind: NodeKind.ClassDeclaration,
      childs: [new NodeStub({kind: NodeKind.Identifier})],
    }).asNode();

    const result = printer.nodePrinter.print(node, {cb: callback});

    expect(result).toMatchSnapshot();
  });

  test('should printNode with childs', () => {
    const callback: PrintNodeCallback = (n, p) =>
      p.colors.header(n.kind.toString());

    const result = printer.nodePrinter.print(
      new NodeStub({kind: NodeKind.ClassDeclaration}).asNode(),
      {cb: callback}
    );

    expect(result).toMatchInlineSnapshot('"ClassDeclaration 252"');
  });

  test('should printNode ignore undefined return by callback', () => {
    const callback: PrintNodeCallback = () => undefined;
    const result = printer.nodePrinter.print(
      new NodeStub({kind: NodeKind.ClassDeclaration}).asNode(),
      {cb: callback}
    );

    expect(result).toMatchInlineSnapshot('"ClassDeclaration"');
  });
});

function createReferenceWithContext() {
  return createReferenceStub(new ProgramContext({} as Program));
}
