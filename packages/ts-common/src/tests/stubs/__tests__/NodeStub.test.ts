import {NodeStub} from '../NodeStub';

test('should two new nodes has sequence id number', () => {
  expect(new NodeStub({}).id).toBe(new NodeStub({}).id - 1);
});
