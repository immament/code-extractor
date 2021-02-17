import ts from 'typescript';
import {Program} from '../compiler/domain/Program';
import {
  ClassDiagram,
  ClassDiagramElement,
  ClassDiagramElementTypes,
  ClassDiagramLink,
} from './model/ClassDiagram.model';
import {FoundNode} from './model/FoundNode';
import {Reference} from './model/Reference';
import {NodeSearcher} from './NodeSearcher';
import {ReferenceSearcher} from './ReferenceSearcher';

export class ClassDiagramExtractor {
  private kindsToElementKindMap: Partial<
    Record<ts.SyntaxKind, ClassDiagramElementTypes>
  > = {
    [ts.SyntaxKind.ClassDeclaration]: 'Class',
    [ts.SyntaxKind.InterfaceDeclaration]: 'Interface',
  };

  private classDiagramSyntaxtKinds = [
    ts.SyntaxKind.ClassDeclaration,
    ts.SyntaxKind.InterfaceDeclaration,
    ts.SyntaxKind.FunctionDeclaration,
    ts.SyntaxKind.VariableDeclaration,
  ];

  private readonly nodeSearcher: NodeSearcher;
  private readonly referenceSearcher: ReferenceSearcher;

  constructor(private readonly program: Program) {
    this.nodeSearcher = new NodeSearcher(this.program.getContext());
    this.referenceSearcher = new ReferenceSearcher(
      this.program.getTypeChecker()
    );
  }

  extract() {
    const foundNodes = this.nodeSearcher.searchExportedDeclarationsInFiles(
      this.program.getSourceFiles(),
      this.classDiagramSyntaxtKinds
    );

    const references = this.referenceSearcher.search(foundNodes);
    return new ClassDiagram(
      this.mapElements(foundNodes),
      this.mapLinks(references)
    );
  }

  private mapElements(foundNodes: FoundNode[]) {
    return foundNodes
      .map(node => this.mapToElement(node))
      .filter(v => !!v) as ClassDiagramElement[];
  }

  private mapToElement(foundNode: FoundNode) {
    const type = this.mapType(foundNode.getNode().kind);
    return type && new ClassDiagramElement(type);
  }

  private mapLinks(references: Reference[]) {
    return references.map(r => this.mapToLink(r));
  }

  private mapToLink(reference: Reference) {
    return new ClassDiagramLink(reference.type || 'Use');
  }

  private mapType(kind: ts.SyntaxKind) {
    return this.kindsToElementKindMap[kind];
  }
}
