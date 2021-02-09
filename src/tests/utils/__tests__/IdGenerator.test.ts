import {IdGenerator} from '../IdGenerator';

test('should generate sequence numbers', () => {
  const first = IdGenerator.next();
  expect(IdGenerator.next()).toBe(first + 1);
  expect(IdGenerator.next()).toBe(first + 2);
  expect(IdGenerator.next()).toBe(first + 3);
  expect(IdGenerator.next()).toBe(first + 4);
});
