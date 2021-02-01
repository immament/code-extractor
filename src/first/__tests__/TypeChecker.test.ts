import ts from 'typescript';
import {TypeChecker} from '../TypeChecker';

describe('TypeChecker', () => {
  test('should be initialized', () => {
    const typechecker = new TypeChecker({} as ts.TypeChecker);
    expect(typechecker).toBeTruthy();
  });
});
