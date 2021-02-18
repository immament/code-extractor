import ts from 'typescript';
import {HeritageClauseable} from './HeritageClauseable';
import {ProgramContext} from './ProgramContext';

export class InterfaceDeclaration extends HeritageClauseable {
  constructor(
    context: ProgramContext,
    protected tsNode: ts.InterfaceDeclaration
  ) {
    super(context, tsNode);
  }
}
