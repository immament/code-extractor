import {NodeStub} from '@imm/ts-common/src/tests/stubs/NodeStub';
import {Reference} from '@lib2/modules/search/model/Reference';
import ts from 'typescript';

export const asNodeStub = (node: ts.Node) => (node as unknown) as NodeStub;

export const referencesToNodeIds = (references: Reference[]) => {
  return references.map(({from, to}) => ({
    fromId: asNodeStub(from.getTsNode()).id,
    toId: asNodeStub(to.getTsNode()).id,
  }));
};
