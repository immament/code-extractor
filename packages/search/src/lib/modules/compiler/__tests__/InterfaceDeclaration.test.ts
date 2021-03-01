import {declarationsFromText} from 'src/tests-common/utils/builders/createProgram';
import {InterfaceDeclaration} from '../domain/InterfaceDeclaration';

describe('InterfaceDeclaration', () => {
  test('should returns extended Interface', () => {
    const [interface1, interface2] = declarationsFromText(
      `interface Interface1 {}
      interface Interface2 extends Interface1 {}`
    ) as InterfaceDeclaration[];

    expect(interface2.getExtends()).toBe(interface1);
  });
});
