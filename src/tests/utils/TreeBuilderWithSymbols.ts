import ts from 'typescript';
import {CreateNodeArgs} from './NodeStub';
import {TreeBuilder} from './TreeBuilder';

export class TreeBuilderWithSymbols extends TreeBuilder {
  private readonly commonSymbols: ts.Symbol[];

  constructor(createNodeArgs?: CreateNodeArgs, symbolCounts = 5) {
    super(createNodeArgs);
    this.commonSymbols = Array(symbolCounts)
      .fill(undefined)
      .map(() => this.newSymbol());
  }

  addLevelWithCommonSymbol(symbolIndex = 0) {
    super.addLevel({symbol: this.commonSymbols[symbolIndex]});
    return this;
  }

  addChildWithCommonSymbol(symbolIndex = 0) {
    super.addChild({symbol: this.commonSymbols[symbolIndex]});
    return this;
  }

  addLevel(createNodeArgs: CreateNodeArgs = {}) {
    if (!createNodeArgs.symbol) {
      createNodeArgs.symbol = this.newSymbol();
    }
    super.addLevel(createNodeArgs);
    return this;
  }

  addChild(createNodeArgs: CreateNodeArgs = {}) {
    if (!createNodeArgs.symbol) {
      createNodeArgs.symbol = this.newSymbol();
    }
    super.addChild(createNodeArgs);
    return this;
  }

  private static lastId = 0;
  private static getNewId() {
    return ++this.lastId;
  }
  private newSymbol() {
    return ({id: TreeBuilderWithSymbols.getNewId()} as unknown) as ts.Symbol;
  }
}
