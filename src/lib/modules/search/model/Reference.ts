import ts from 'typescript';
import {FoundNode} from './FoundNode';

export class Reference {
  fromNode?: ts.Node;
  constructor(public from: FoundNode, public to: FoundNode) {}
}
