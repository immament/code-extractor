import ts from 'typescript';
import {TreeBuilder} from '../../tests/utils/TreeBuilder';
import {Project} from '../Project';

describe('Search for one kind', () => {
  const searchedKind = 100;

  let builder: TreeBuilder;
  let project: Project;

  beforeEach(() => {
    project = new Project();
    builder = new TreeBuilder({kind: ts.SyntaxKind.SourceFile});
  });

  test('should not find any items ', () => {
    expect(
      project.searchInFile(
        builder
          .addChildAndGoTo()
          .addChild()
          .addChild()
          .getResult() as ts.SourceFile,
        [searchedKind]
      )
    ).toHaveLength(0);
  });

  test('should find 1 item with specified kind', () => {
    expect(
      project.searchInFile(
        builder
          .addChildAndGoTo()
          .addChildAndGoTo()
          .addChildAndGoTo()
          .addChild()
          .addChild({kind: searchedKind})
          .getResult() as ts.SourceFile,
        [searchedKind]
      )
    ).toHaveLength(1);
  });

  test('should find 2 items with specified kind', () => {
    expect(
      project.searchInFile(
        builder
          .addChildAndGoTo()
          .addChild({kind: searchedKind})
          .addChild({kind: searchedKind})
          .getResult() as ts.SourceFile,
        [searchedKind]
      )
    ).toHaveLength(2);
  });

  test('should find 2 items when one node is nested in another', () => {
    expect(
      project.searchInFile(
        builder
          .addChildAndGoTo({kind: searchedKind})
          .addChild({kind: searchedKind})
          .addChild()
          .getResult() as ts.SourceFile,
        [searchedKind]
      )
    ).toHaveLength(2);
  });

  test('should find 3 items when nodes are nested in separated nodes', () => {
    expect(
      project.searchInFile(
        builder
          .addChildAndGoTo({kind: searchedKind})
          .addChild()
          .addChild()
          .up()
          .addChildAndGoTo()
          .addChild({kind: searchedKind})
          .addChild()
          .up()
          .addChildAndGoTo()
          .addChild()
          .addChild({kind: searchedKind})
          .getResult() as ts.SourceFile,
        [searchedKind]
      )
    ).toHaveLength(3);
  });
});

describe('Search for multiple kinds', () => {
  const searchedKinds = [100, 101, 102, 103, 2000];

  let builder: TreeBuilder;
  let project: Project;

  beforeEach(() => {
    project = new Project();
    builder = new TreeBuilder({kind: ts.SyntaxKind.SourceFile});
  });

  test('should not find any items ', () => {
    const sourceFile = builder
      .addChildAndGoTo()
      .addChild()
      .addChild()
      .getResult() as ts.SourceFile;
    expect(project.searchInFile(sourceFile, searchedKinds)).toHaveLength(0);
  });

  test('should find 5 items with 5 different kinds', () => {
    const sourceFile = builder
      .addChild({kind: searchedKinds[0]})
      .addChildAndGoTo()
      .addChildAndGoTo()
      .addChildAndGoTo({kind: searchedKinds[1]})
      .addChild()
      .addChild({kind: searchedKinds[2]})
      .addChildAndGoTo({kind: searchedKinds[3]})
      .toRoot()
      .addChildAndGoTo()
      .addChildAndGoTo()
      .addChildAndGoTo({kind: searchedKinds[4]})
      .getResult() as ts.SourceFile;

    expect(project.searchInFile(sourceFile, searchedKinds)).toHaveLength(5);
  });

  test('should find 7 items with 2 different kinds', () => {
    const sourceFile = builder
      .addChild({kind: searchedKinds[0]})
      .addChildAndGoTo()
      .addChildAndGoTo()
      .addChildAndGoTo({kind: searchedKinds[1]})
      .addChild()
      .addChild({kind: searchedKinds[0]})
      .addChildAndGoTo({kind: searchedKinds[1]})
      .toRoot()
      .addChildAndGoTo({kind: searchedKinds[1]})
      .addChildAndGoTo({kind: searchedKinds[1]})
      .addChildAndGoTo({kind: searchedKinds[0]})
      .getResult() as ts.SourceFile;

    expect(project.searchInFile(sourceFile, searchedKinds)).toHaveLength(7);
  });
});
