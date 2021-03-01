import {Node} from '@imm/ts-common/src/lib/modules/compiler/domain/Node';
import {FoundNode} from './FoundNode';

export type ReferenceType = 'Implements' | 'Extends' | 'Aggregation' | 'Use';

export class Reference {
  fromNode?: Node; // tmp: devonly

  constructor(
    public from: FoundNode,
    public to: FoundNode,
    public type: ReferenceType
  ) {}

  equalTo(reference: Reference) {
    return (
      reference.from === this.from &&
      reference.to === this.to &&
      reference.type === this.type
    );
  }
}
