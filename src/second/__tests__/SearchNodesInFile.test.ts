import ts from 'typescript';
import {TreeBuilder} from '../../tests/utils/TreeBuilder';
import {Project} from '../Project';

describe('Search for one kind', () => {
  const kindSearched = 100;

  let builder: TreeBuilder;
  let project: Project;

  beforeEach(() => {
    project = new Project();
    builder = new TreeBuilder({kind: ts.SyntaxKind.SourceFile});
  });

  test('should not find any items when kind specified', () => {
    expect(
      project.searchInFile(
        builder.addLevel().addChild().addChild().getResult() as ts.SourceFile,
        [kindSearched]
      )
    ).toHaveLength(0);
  });

  test('should find 1 item with specified kind', () => {
    expect(
      project.searchInFile(
        builder
          .addLevel()
          .addLevel()
          .addLevel()
          .addChild()
          .addChild({kind: kindSearched})
          .getResult() as ts.SourceFile,
        [kindSearched]
      )
    ).toHaveLength(1);
  });

  test('should find 2 items with specified kind', () => {
    expect(
      project.searchInFile(
        builder
          .addLevel()
          .addChild({kind: kindSearched})
          .addChild({kind: kindSearched})
          .getResult() as ts.SourceFile,
        [kindSearched]
      )
    ).toHaveLength(2);
  });

  test('should find 2 items when one node is nested in another', () => {
    expect(
      project.searchInFile(
        builder
          .addLevel({kind: kindSearched})
          .addChild({kind: kindSearched})
          .addChild()
          .getResult() as ts.SourceFile,
        [kindSearched]
      )
    ).toHaveLength(2);
  });

  test('should find 3 items when nodes are nested in separated nodes', () => {
    expect(
      project.searchInFile(
        builder
          .addLevel({kind: kindSearched})
          .addChild()
          .addChild()
          .up()
          .addLevel()
          .addChild({kind: kindSearched})
          .addChild()
          .up()
          .addLevel()
          .addChild()
          .addChild({kind: kindSearched})
          .getResult() as ts.SourceFile,
        [kindSearched]
      )
    ).toHaveLength(3);
  });
});
