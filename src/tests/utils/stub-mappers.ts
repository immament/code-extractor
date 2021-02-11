import {NodeStub} from '@tests/stubs/NodeStub';
import ts from 'typescript';

import {Reference} from 'src/lib/Reference';

export const asNodeStub = (node: ts.Node) => (node as unknown) as NodeStub;

export const referencesToNodeIds = (references: Reference[]) => {
  return references.map(({from, to}) => ({
    fromId: asNodeStub(from.getNode()).id,
    toId: asNodeStub(to.getNode()).id,
  }));
};
