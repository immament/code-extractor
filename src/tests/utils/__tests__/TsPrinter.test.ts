import {NodeStub} from '@tests/stubs/NodeStub';

import ts from 'typescript';
import {createSourceFile} from '../createSourceFile';
import {createReference} from '../stubCreators';
import {TsPrinter} from '../TsPrinter';

describe('TsPrinter with default options', () => {
  let printer: TsPrinter;

  beforeEach(() => {
    printer = new TsPrinter();
  });

  test('should printNode without childs result match snampshot', () => {
    const result = printer.printNode(
      new NodeStub({kind: ts.SyntaxKind.ClassDeclaration}).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should printNodeWithoutChilds result match snampshot', () => {
    const result = printer.printNodeWithoutChilds(
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

    const result = printer.printNode(sourceFile);

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

  test('should printNode without childs result match snampshot', () => {
    const result = printer.printNode(
      new NodeStub({kind: ts.SyntaxKind.ClassDeclaration}).asNode()
    );

    expect(result).toMatchSnapshot();
  });

  test('should printNodeWithoutChilds result match snampshot', () => {
    const result = printer.printNodeWithoutChilds(
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

    const result = printer.printNode(sourceFile);

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
});
