import {TreeBuilderWithSymbols} from '../TreeBuilderWithSymbols';

describe('Name of the group', () => {
  let builder: TreeBuilderWithSymbols;

  describe('Test add level', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols();
    });
    test('should add node with common symbol', () => {
      builder.addLevelWithCommonSymbol();
      expect(builder.current.symbol).toBeTruthy();
    });

    test('should add 2 nodes with the same common symbol', () => {
      builder.addLevelWithCommonSymbol();
      const symbol1 = builder.current.symbol;
      builder.addLevelWithCommonSymbol();
      expect(builder.current.symbol).toBe(symbol1);
    });

    test('should add node and child node with the same symbol', () => {
      builder.addLevelWithCommonSymbol();
      const symbol1 = builder.current.symbol;
      builder.addChildWithCommonSymbol();
      expect(builder.current.childs[0].symbol).toBe(symbol1);
    });

    test('should add 2 nodes with the diffrent symbol', () => {
      builder.addLevel();
      const symbol1 = builder.current.symbol;
      builder.addLevel();
      expect(builder.current.symbol).not.toBe(symbol1);
    });
  });

  describe('Test add childs', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols({});
    });
    test('should add 2 childs with the same symbol', () => {
      builder.addChildWithCommonSymbol();
      builder.addChildWithCommonSymbol();
      expect(builder.current.childs[0].symbol).toBe(
        builder.current.childs[1].symbol
      );
    });

    test('should add 2 childs with diffrent symbol', () => {
      builder.addChildWithCommonSymbol();
      builder.addChild();
      expect(builder.current.childs[0].symbol).not.toBe(
        builder.current.childs[1].symbol
      );
    });
  });

  test('methods with fluent behavioure', () => {
    builder = new TreeBuilderWithSymbols({});
    expect(builder.addLevel()).toBe(builder);
    expect(builder.addChild()).toBe(builder);
    expect(builder.toChild()).toBe(builder);
    expect(builder.up()).toBe(builder);
    expect(builder.reset({})).toBe(builder);
    expect(builder.toRoot()).toBe(builder);
    expect(builder.addChildWithCommonSymbol()).toBe(builder);
    expect(builder.addLevelWithCommonSymbol()).toBe(builder);
  });

  describe('With multiple common symbols', () => {
    describe('addLevelWithCommonSymbol', () => {
      beforeEach(() => {
        builder = new TreeBuilderWithSymbols();
      });
      test('should using without argument add symbol with index 0', () => {
        const symbol1 = builder.addLevelWithCommonSymbol().current.symbol;
        const symbol2 = builder.addLevelWithCommonSymbol(0).current.symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with the same index add the same symbol', () => {
        const symbol1 = builder.addLevelWithCommonSymbol(0).current.symbol;
        const symbol2 = builder.addLevelWithCommonSymbol(0).current.symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with diffrent index add different symbol', () => {
        const symbol1 = builder.addLevelWithCommonSymbol(1).current.symbol;
        const symbol2 = builder.addLevelWithCommonSymbol(2).current.symbol;

        expect(symbol1).not.toBe(symbol2);
      });
    });

    describe('addChildWithCommonSymbol', () => {
      beforeEach(() => {
        builder = new TreeBuilderWithSymbols({});
      });
      test('should using without argument add symbol with index 0', () => {
        builder.addChildWithCommonSymbol().addChildWithCommonSymbol(0);
        const symbol1 = builder.current.childs[0].symbol;
        const symbol2 = builder.current.childs[1].symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with the same index add the same symbol', () => {
        builder.addChildWithCommonSymbol(1).addChildWithCommonSymbol(1);
        const symbol1 = builder.current.childs[0].symbol;
        const symbol2 = builder.current.childs[1].symbol;
        expect(symbol1).toBe(symbol2);
      });

      test('should using with diffrent index add different symbol', () => {
        builder.addChildWithCommonSymbol(1).addChildWithCommonSymbol(2);
        const symbol1 = builder.current.childs[0].symbol;
        const symbol2 = builder.current.childs[1].symbol;

        expect(symbol1).not.toBe(symbol2);
      });
    });
    describe('mix methods', () => {
      test('should using without argument add symbol with index 0', () => {
        builder.addLevelWithCommonSymbol().addChildWithCommonSymbol(0);
        const symbol1 = builder.current.symbol;
        const symbol2 = builder.current.childs[0].symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with the same index add the same symbol', () => {
        builder.addLevelWithCommonSymbol(1).addChildWithCommonSymbol(1);
        const symbol1 = builder.current.symbol;
        const symbol2 = builder.current.childs[0].symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with diffrent index add different symbol', () => {
        builder.addLevelWithCommonSymbol(1).addChildWithCommonSymbol(2).current;
        const symbol1 = builder.current.symbol;
        const symbol2 = builder.current.childs[0].symbol;

        expect(symbol1).not.toBe(symbol2);
      });
    });
  });
});
