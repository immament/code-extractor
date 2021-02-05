import {ExTreeBuilder} from '../ExTreeBuilder';

describe('Name of the group', () => {
  let builder: ExTreeBuilder;

  describe('Test add level', () => {
    beforeEach(() => {
      builder = new ExTreeBuilder();
    });
    test('should add node with common symbol', () => {
      builder.addLevelWithCommonSymbol();
      expect(builder.current.getSymbol()).toBeTruthy();
    });

    test('should add 2 nodes with the same common symbol', () => {
      builder.addLevelWithCommonSymbol();
      const symbol1 = builder.current.getSymbol();
      builder.addLevelWithCommonSymbol();
      expect(builder.current.getSymbol()).toBe(symbol1);
    });

    test('should add node and child node with the same symbol', () => {
      builder.addLevelWithCommonSymbol();
      const symbol1 = builder.current.getSymbol();
      builder.addChildWithCommonSymbol();
      expect(builder.current.childs[0].getSymbol()).toBe(symbol1);
    });

    test('should add 2 nodes with the diffrent symbol', () => {
      builder.addLevel();
      const symbol1 = builder.current.getSymbol();
      builder.addLevel();
      expect(builder.current.getSymbol()).not.toBe(symbol1);
    });
  });

  describe('Test add childs', () => {
    beforeEach(() => {
      builder = new ExTreeBuilder({});
    });
    test('should add 2 childs with the same symbol', () => {
      builder.addChildWithCommonSymbol();
      builder.addChildWithCommonSymbol();
      expect(builder.current.childs[0].getSymbol()).toBe(
        builder.current.childs[1].getSymbol()
      );
    });

    test('should add 2 childs with diffrent symbol', () => {
      builder.addChildWithCommonSymbol();
      builder.addChild();
      expect(builder.current.childs[0].getSymbol()).not.toBe(
        builder.current.childs[1].getSymbol()
      );
    });
  });

  test('methods with fluent behavioure', () => {
    builder = new ExTreeBuilder({});
    expect(builder.addLevel()).toBe(builder);
    expect(builder.addChild()).toBe(builder);
    expect(builder.up()).toBe(builder);
    expect(builder.reset({})).toBe(builder);
    expect(builder.toRoot()).toBe(builder);
    expect(builder.addChildWithCommonSymbol()).toBe(builder);
    expect(builder.addLevelWithCommonSymbol()).toBe(builder);
  });
});
