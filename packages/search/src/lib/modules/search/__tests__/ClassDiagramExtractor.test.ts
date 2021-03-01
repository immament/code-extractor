import {Program} from '@imm/ts-common/src/lib/modules/compiler/domain/Program';
import {NodeKind} from '@imm/ts-common/src/lib/modules/compiler/domain/SyntaxKind';
import {createFoundNode} from '@tests2/utils/builders/createFoundNode';
import ts from 'typescript';
import {ClassDiagramExtractor} from '../ClassDiagramExtractor';
import {ClassDiagramLink} from '../model/ClassDiagram.model';
import {FoundNode} from '../model/FoundNode';
import {Reference} from '../model/Reference';
import {mockSearchExportedDeclarationsInFiles} from './NodeSearcher.mock';
import {mockReferenceSearch} from './ReferenceSearcher.mock';

jest.mock('../NodeSearcher');
jest.mock('../ReferenceSearcher');
jest.mock('@imm/ts-common/src/lib/modules/compiler/domain/Program');

describe('ClassDiagramExtractor', () => {
  let program: Program;
  let extractor: ClassDiagramExtractor;

  beforeEach(() => {
    mockSearchExportedDeclarationsInFiles.mockReset();
    mockReferenceSearch.mockReset();
    program = new Program({} as ts.CreateProgramOptions);
    extractor = new ClassDiagramExtractor(program);
  });

  describe('elements', () => {
    test('should extract result has one element', () => {
      const foundNodes = [
        createFoundNode({
          context: program.getContext(),
          kind: NodeKind.ClassDeclaration,
        }),
      ];
      mockSearchResults(foundNodes, []);

      const result = extractor.extract();
      expect(result.getElements()).toHaveLength(1);
    });

    test('should extract() search class diagram elements', () => {
      const expectedSearchedElements = [
        NodeKind.ClassDeclaration,
        NodeKind.InterfaceDeclaration,
        NodeKind.VariableDeclaration,
        NodeKind.FunctionDeclaration,
      ];
      mockSearchResults([], []);

      const extractResult = extractor.extract();

      const searchedKindsArg = mockSearchExportedDeclarationsInFiles.mock
        .calls[0][1] as NodeKind[];

      expect(extractResult.getElements()).toHaveLength(0);
      expect(
        expectedSearchedElements.every(kind => searchedKindsArg.includes(kind))
      ).toBeTruthy();
    });
  });

  describe('links', () => {
    test('should extract result has one link', () => {
      const foundNodes = [createFoundNode(), createFoundNode()];
      const foundReferences = [{}] as Reference[];

      mockSearchResults(foundNodes, foundReferences);

      const result = extractor.extract();
      expect(result.getLinks()).toHaveLength(1);
    });

    test('should reference search be called with fsound nodes from NodeSearcher', () => {
      const foundNodes = [createFoundNode(), createFoundNode()];
      const foundReferences = [{}, {}] as Reference[];
      mockSearchResults(foundNodes, foundReferences);
      extractor.extract();

      // WARN: check implementation not result
      expect(mockReferenceSearch).toBeCalledWith(foundNodes);
    });
  });

  describe('Full', () => {
    test('should returns diagram with "use" link ', () => {
      const expectedResult = {
        elements: [{type: 'Class'}, {type: 'Interface'}],
        links: [{type: 'Use'}],
      };
      const foundNodes = [
        createFoundNode({
          kind: NodeKind.ClassDeclaration,
        }),
        createFoundNode({
          kind: NodeKind.InterfaceDeclaration,
        }),
      ];

      const foundReferences = [
        new Reference(foundNodes[0], foundNodes[1], 'Use'),
      ] as Reference[];

      mockSearchResults(foundNodes, foundReferences);

      const result = extractor.extract();

      expect(result).toMatchObject(expectedResult);
    });

    test('should returns diagram with "Implements" link ', () => {
      const expectedResult = {
        elements: [{type: 'Class'}, {type: 'Interface'}],
        links: [new ClassDiagramLink('Implements')],
      };
      const foundNodes = createFoundNodes([
        NodeKind.ClassDeclaration,
        NodeKind.InterfaceDeclaration,
      ]);

      const foundReferences = [
        new Reference(foundNodes[0], foundNodes[1], 'Implements'),
      ];
      mockSearchResults(foundNodes, foundReferences);

      const result = extractor.extract();
      expect(result).toMatchObject(expectedResult);
    });
  });

  function createFoundNodes(kinds: NodeKind[]) {
    return kinds.map(kind => createFoundNode({kind}));
  }

  function mockSearchResults(
    foundNodes: FoundNode[],
    foundReferences: Reference[]
  ) {
    mockSearchExportedDeclarationsInFiles.mockReturnValue(foundNodes);
    mockReferenceSearch.mockReturnValue(foundReferences);
  }
});
