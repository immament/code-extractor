// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockedFn<T extends (...args: any[]) => any>(item: T) {
  return item as jest.MockedFunction<T>;
}

export function mocked<T>(item: T): jest.Mocked<T> {
  return (item as unknown) as jest.Mocked<T>;
}
