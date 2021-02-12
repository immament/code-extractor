import {NodeStub} from '@tests/stubs/NodeStub';

import ts from 'typescript';
import {createItem} from '../builders/createItem';
import {createSourceFile} from '../builders/createSourceFile';

import {createReference} from '../builders/stubCreators';
import {PrintNodeCallback} from '../print/NodePrinter';
import {TsPrinter} from '../print/TsPrinter';

describe('TsPrinter with default options', () => {
  let printer: TsPrinter;

  beforeEach(() => {
    printer = new TsPrinter();
  });

  test('should printNode without childs result match snampshot', () => {
    const result = printer.nodePrinter.printNode(
      new NodeStub({kind: ts.SyntaxKind.ClassDeclaration}).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should printNodeWithoutChilds result match snampshot', () => {
    const result = printer.nodePrinter.printNodeWithoutChilds(
      new NodeStub({
        kind: ts.SyntaxKind.ClassDeclaration,
        childs: [new NodeStub({kind: ts.SyntaxKind.Identifier})],
      }).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should print node with childs', () => {
    const sourceFile = createSourceFile(
      '/index.ts',
      'class MyClass { myMethod() {}}'
    );

    const result = printer.nodePrinter.printNode(sourceFile);

    expect(result).toMatchSnapshot();
  });

  test('should print references', () => {
    const references = [
      createReference(),
      createReference(),
      createReference(),
    ];
    expect(printer.printReferences(references)).toMatchSnapshot();
  });

  test('should print references without fromNode', () => {
    const reference = createReference();
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
    const result = printer.nodePrinter.printNode(
      new NodeStub({kind: ts.SyntaxKind.ClassDeclaration}).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should printNodeWithoutChilds', () => {
    const result = printer.nodePrinter.printNodeWithoutChilds(
      new NodeStub({
        kind: ts.SyntaxKind.ClassDeclaration,
        childs: [new NodeStub({kind: ts.SyntaxKind.Identifier})],
      }).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should print node with childs', () => {
    const sourceFile = createSourceFile(
      '/index.ts',
      'class MyClass { myMethod() {}}'
    );

    const result = printer.nodePrinter.printNode(sourceFile);

    expect(result).toMatchSnapshot();
  });

  test('should print references', () => {
    const references = [
      createReference(),
      createReference(),
      createReference(),
    ];
    expect(printer.printReferences(references)).toMatchSnapshot();
  });

  test('should print item', () => {
    expect(printer.printItemAsArray(createItem())).toMatchSnapshot();
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
      kind: ts.SyntaxKind.ClassDeclaration,
      childs: [new NodeStub({kind: ts.SyntaxKind.Identifier})],
    }).asNode();

    const result = printer.nodePrinter.printNode(node, {cb: callback});

    expect(result).toMatchSnapshot();
  });

  test('should printNode with childs', () => {
    const callback: PrintNodeCallback = (n, p) =>
      p.colors.header(n.kind.toString());

    const result = printer.nodePrinter.printNode(
      new NodeStub({kind: ts.SyntaxKind.ClassDeclaration}).asNode(),
      {cb: callback}
    );

    expect(result).toMatchInlineSnapshot('"ClassDeclaration 252"');
  });

  test('should printNode ignore undefined return by callback', () => {
    const callback: PrintNodeCallback = () => undefined;
    const result = printer.nodePrinter.printNode(
      new NodeStub({kind: ts.SyntaxKind.ClassDeclaration}).asNode(),
      {cb: callback}
    );

    expect(result).toMatchInlineSnapshot('"ClassDeclaration"');
  });
});
