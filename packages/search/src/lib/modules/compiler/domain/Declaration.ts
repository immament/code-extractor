import ts from 'typescript';
import {Node} from './Node';
import {ProgramContext} from './ProgramContext';

export class Declaration extends Node {
  constructor(context: ProgramContext, protected tsNode: ts.Declaration) {
    super(context, tsNode);
  }
}
