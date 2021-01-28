export function mocked<T>(item: unknown) {
  return item as jest.Mock<T>;
}
