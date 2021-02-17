import {Node} from '@lib/modules/compiler/domain/Node';
import {FoundNode} from './FoundNode';

export type ReferenceType = 'Implements' | 'Extends' | 'Aggregation' | 'Use';

export class Reference {
  fromNode?: Node; // tmp: devonly

  constructor(
    public from: FoundNode,
    public to: FoundNode,
    public type: ReferenceType
  ) {}
}
