import {Project} from '../Project';
import {createSourceFile} from './createSourceFile';
import {createNode} from './NodeStub';

let project: Project;
beforeAll(() => {
  project = new Project();
});

describe('Search with filter', () => {
  const kindSearched = 100;

  test('should not find any items when kind specified', () => {
    expect(
      project.searchInFile(createSourceFile([createNode(), createNode()]), [
        kindSearched,
      ])
    ).toHaveLength(0);
  });

  test('should find 1 item with specified kind', () => {
    expect(
      project.searchInFile(
        createSourceFile([createNode(), createNode({kind: kindSearched})]),
        [kindSearched]
      )
    ).toHaveLength(1);
  });

  test('should find 2 items with specified kind', () => {
    expect(
      project.searchInFile(
        createSourceFile([
          createNode({kind: kindSearched}),
          createNode({kind: kindSearched}),
        ]),
        [kindSearched]
      )
    ).toHaveLength(2);
  });

  test('should find 2 items when one node is nested in another', () => {
    expect(
      project.searchInFile(
        createSourceFile([
          createNode({
            kind: kindSearched,
            nodes: [createNode({kind: kindSearched}), createNode({kind: 1})],
          }),
        ]),
        [kindSearched]
      )
    ).toHaveLength(2);
  });

  test('should find 3 items when nodes are nested in separated nodes', () => {
    expect(
      project.searchInFile(
        createSourceFile([
          createNode({
            kind: kindSearched,
            nodes: [createNode(), createNode()],
          }),
          createNode({
            nodes: [createNode({kind: kindSearched}), createNode()],
          }),
          createNode({
            nodes: [createNode(), createNode({kind: kindSearched})],
          }),
        ]),
        [kindSearched]
      )
    ).toHaveLength(3);
  });

  test('should find 1 item when nodes are nested in 3 levels', () => {
    expect(
      project.searchInFile(
        createSourceFile([
          createNode({
            nodes: [
              createNode({
                nodes: [createNode({kind: kindSearched})],
              }),
            ],
          }),
        ]),
        [kindSearched]
      )
    ).toHaveLength(1);
  });
});
