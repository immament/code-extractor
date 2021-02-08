import ts from 'typescript';
import {CreateNodeArgs} from '../stubs/NodeStub';
import {TreeBuilder} from './TreeBuilder';

export class TreeBuilderWithSymbols extends TreeBuilder {
  private readonly commonSymbols: ts.Symbol[];

  constructor(createNodeArgs?: CreateNodeArgs, symbolCounts = 5) {
    super(createNodeArgs);
    this.commonSymbols = this.createSymbols(symbolCounts);
  }

  private createSymbols(symbolCounts: number) {
    return [...Array(symbolCounts)].map(() => this.newSymbol());
  }

  addChildWithSymbolAndGoTo(symbolIndex = 0) {
    super.addChildAndGoTo({symbol: this.commonSymbols[symbolIndex]});
    return this;
  }

  addChildWithSymbol(symbolIndex = 0) {
    super.addChild({symbol: this.commonSymbols[symbolIndex]});
    return this;
  }

  addChildAndGoTo(createNodeArgs: CreateNodeArgs = {}) {
    if (!createNodeArgs.symbol) {
      createNodeArgs.symbol = this.newSymbol();
    }
    super.addChildAndGoTo(createNodeArgs);
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
