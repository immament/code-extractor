import {Reference} from '@lib/modules/search/model/Reference';
import {NodeStub} from 'src/tests-common/stubs/NodeStub';
import ts from 'typescript';

export const asNodeStub = (node: ts.Node) => (node as unknown) as NodeStub;

export const referencesToNodeIds = (references: Reference[]) => {
  return references.map(({from, to}) => ({
    fromId: asNodeStub(from.getTsNode()).id,
    toId: asNodeStub(to.getTsNode()).id,
  }));
};
