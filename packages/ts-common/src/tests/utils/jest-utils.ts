// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockFn<F extends (...args: any[]) => any>(
  impl?: (...args: jest.ArgsType<F>) => ReturnType<F>
) {
  return (jest.fn(impl) as unknown) as jest.MockedFunction<F>;
}

// export function spyOnMethod<T, M extends jest.FunctionPropertyNames<T>>(
//   object: T,
//   method: M
// ) {
//   return jest.spyOn(object, method);
// }
