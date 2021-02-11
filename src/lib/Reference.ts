import ts from 'typescript';
import {Item} from './Item';

export class Reference {
  fromNode?: ts.Node;
  constructor(public from: Item, public to: Item) {}
}
