import {FoundNode} from './FoundNode';
import {Node} from './Node';

export interface NodeFilter {
  filter(node: Node): FoundNode | undefined;
}
