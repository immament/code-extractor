import {declarationsFromText} from '@tests/utils/builders/createProgram';
import {ClassDeclaration} from '../domain/ClassDeclaration';
import {Node} from '../domain/Node';

describe('ClassDeclaration', () => {
  test('should returns extended ClassDeclaration', () => {
    const [class1, class2] = declarationsFromText(
      `class Class1 {}
      class Class2 extends Class1 {}`
    ) as ClassDeclaration[];

    expect(class2.getExtended()).toBe(class1);
  });

  test('should returns implemented Interface ', () => {
    const [interface1, class1] = declarationsFromText(
      `interface Interface1 {}
      class Class1 implements Interface1 {}`
    ) as [Node, ClassDeclaration];

    const implemented = class1.getImplements();

    expect(implemented).toHaveLength(1);
    expect(implemented).toContainEqual(interface1);
  });

  test('should returns implemented Interfaces', () => {
    const [interface1, interface2, class1] = declarationsFromText(
      `interface Interface1 {}
       interface Interface2 {}
       class Class1 implements Interface1, Interface2 {}`
    ) as [Node, Node, ClassDeclaration];

    const implemented = class1.getImplements();

    expect(implemented).toHaveLength(2);
    expect(implemented).toContainEqual(interface1);
    expect(implemented).toContainEqual(interface2);
  });

  test('should returns implemented Class', () => {
    const [class1, class2] = declarationsFromText(
      `interface Class1 {}
       class Class2 implements Class1 {}`
    ) as [Node, ClassDeclaration];

    const implemented = class2.getImplements();

    expect(implemented).toHaveLength(1);
    expect(implemented).toContainEqual(class1);
  });
});
