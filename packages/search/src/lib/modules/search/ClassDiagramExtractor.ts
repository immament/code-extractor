import {Program} from '@imm/ts-common/src/lib/modules/compiler/domain/Program';
import {NodeKind} from '@imm/ts-common/src/lib/modules/compiler/domain/SyntaxKind';
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
    Record<NodeKind, ClassDiagramElementTypes>
  > = {
    [NodeKind.ClassDeclaration]: 'Class',
    [NodeKind.InterfaceDeclaration]: 'Interface',
  };

  private classDiagramSyntaxtKinds = [
    NodeKind.ClassDeclaration,
    NodeKind.InterfaceDeclaration,
    NodeKind.FunctionDeclaration,
    NodeKind.VariableDeclaration,
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

  private mapType(kind: NodeKind) {
    return this.kindsToElementKindMap[kind];
  }
}
