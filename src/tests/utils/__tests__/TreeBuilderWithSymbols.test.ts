import {TreeBuilderWithSymbols} from '../TreeBuilderWithSymbols';

describe('TreeBuilderWithSymbols', () => {
  let builder: TreeBuilderWithSymbols;

  describe('Test add level', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols();
    });
    test('should add node with common symbol', () => {
      builder.addChildWithSymbolAndGoTo();
      expect(builder.current.symbol).toBeTruthy();
    });

    test('should add 2 nodes with the same common symbol', () => {
      builder.addChildWithSymbolAndGoTo();
      const symbol1 = builder.current.symbol;
      builder.addChildWithSymbolAndGoTo();
      expect(builder.current.symbol).toBe(symbol1);
    });

    test('should add node and child node with the same symbol', () => {
      builder.addChildWithSymbolAndGoTo();
      const symbol1 = builder.current.symbol;
      builder.addChildWithSymbol();
      expect(builder.current.childs[0].symbol).toBe(symbol1);
    });

    test('should add 2 nodes with the diffrent symbol', () => {
      builder.addChildAndGoTo();
      const symbol1 = builder.current.symbol;
      builder.addChildAndGoTo();
      expect(builder.current.symbol).not.toBe(symbol1);
    });
  });

  describe('Test add childs', () => {
    beforeEach(() => {
      builder = new TreeBuilderWithSymbols({});
    });
    test('should add 2 childs with the same symbol', () => {
      builder.addChildWithSymbol();
      builder.addChildWithSymbol();
      expect(builder.current.childs[0].symbol).toBe(
        builder.current.childs[1].symbol
      );
    });

    test('should add 2 childs with diffrent symbol', () => {
      builder.addChildWithSymbol();
      builder.addChild();
      expect(builder.current.childs[0].symbol).not.toBe(
        builder.current.childs[1].symbol
      );
    });
  });

  test('methods with fluent behaviour', () => {
    builder = new TreeBuilderWithSymbols({});
    expect(builder.addChildAndGoTo()).toBe(builder);
    expect(builder.addChild()).toBe(builder);
    expect(builder.toChild()).toBe(builder);
    expect(builder.up()).toBe(builder);
    expect(builder.reset({})).toBe(builder);
    expect(builder.toRoot()).toBe(builder);
    expect(builder.addChildWithSymbol()).toBe(builder);
    expect(builder.addChildWithSymbolAndGoTo()).toBe(builder);
  });

  describe('With multiple common symbols', () => {
    describe('addLevelWithCommonSymbol', () => {
      beforeEach(() => {
        builder = new TreeBuilderWithSymbols();
      });
      test('should using without argument add symbol with index 0', () => {
        const symbol1 = builder.addChildWithSymbolAndGoTo().current.symbol;
        const symbol2 = builder.addChildWithSymbolAndGoTo(0).current.symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with the same index add the same symbol', () => {
        const symbol1 = builder.addChildWithSymbolAndGoTo(0).current.symbol;
        const symbol2 = builder.addChildWithSymbolAndGoTo(0).current.symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with diffrent index add different symbol', () => {
        const symbol1 = builder.addChildWithSymbolAndGoTo(1).current.symbol;
        const symbol2 = builder.addChildWithSymbolAndGoTo(2).current.symbol;

        expect(symbol1).not.toBe(symbol2);
      });
    });

    describe('addChildWithCommonSymbol', () => {
      beforeEach(() => {
        builder = new TreeBuilderWithSymbols({});
      });
      test('should using without argument add symbol with index 0', () => {
        builder.addChildWithSymbol().addChildWithSymbol(0);
        const symbol1 = builder.current.childs[0].symbol;
        const symbol2 = builder.current.childs[1].symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with the same index add the same symbol', () => {
        builder.addChildWithSymbol(1).addChildWithSymbol(1);
        const symbol1 = builder.current.childs[0].symbol;
        const symbol2 = builder.current.childs[1].symbol;
        expect(symbol1).toBe(symbol2);
      });

      test('should using with diffrent index add different symbol', () => {
        builder.addChildWithSymbol(1).addChildWithSymbol(2);
        const symbol1 = builder.current.childs[0].symbol;
        const symbol2 = builder.current.childs[1].symbol;

        expect(symbol1).not.toBe(symbol2);
      });
    });
    describe('mix methods', () => {
      test('should using without argument add symbol with index 0', () => {
        builder.addChildWithSymbolAndGoTo().addChildWithSymbol(0);
        const symbol1 = builder.current.symbol;
        const symbol2 = builder.current.childs[0].symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with the same index add the same symbol', () => {
        builder.addChildWithSymbolAndGoTo(1).addChildWithSymbol(1);
        const symbol1 = builder.current.symbol;
        const symbol2 = builder.current.childs[0].symbol;

        expect(symbol1).toBe(symbol2);
      });

      test('should using with diffrent index add different symbol', () => {
        builder.addChildWithSymbolAndGoTo(1).addChildWithSymbol(2).current;
        const symbol1 = builder.current.symbol;
        const symbol2 = builder.current.childs[0].symbol;

        expect(symbol1).not.toBe(symbol2);
      });
    });
  });
});
