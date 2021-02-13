import {Node} from '@lib/modules/compiler/domain/Node';
import {FoundNode} from './FoundNode';

export class Reference {
  fromNode?: Node;
  constructor(public from: FoundNode, public to: FoundNode) {}
}
