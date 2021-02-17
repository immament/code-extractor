export class ClassDiagram {
  constructor(
    private elements: ClassDiagramElement[],
    private links: ClassDiagramLink[]
  ) {}

  getElements() {
    return this.elements;
  }

  getLinks() {
    return this.links;
  }
}

export class ClassDiagramElement {
  constructor(private type: ClassDiagramElementTypes) {}

  getType() {
    return this.type;
  }
}

export class ClassDiagramLink {
  constructor(private type: ClassDiagramLinkTypes) {}

  getType() {
    return this.type;
  }
}

export type ClassDiagramElementTypes =
  | 'Class'
  | 'Interface'
  | 'Variable'
  | 'Function';

export type ClassDiagramLinkTypes =
  | 'Implements'
  | 'Extends'
  | 'Aggregation'
  | 'Use';
