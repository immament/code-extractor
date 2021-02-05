import ts from 'typescript';
import {CreateNodeArgs} from './NodeStub';
import {TreeBuilder} from './TreeBuilder';

export class ExTreeBuilder extends TreeBuilder {
  private commonSymbol = this.newSymbol();

  addLevelWithCommonSymbol() {
    super.addLevel({symbol: this.commonSymbol});
    return this;
  }

  addChildWithCommonSymbol() {
    super.addChild({symbol: this.commonSymbol});
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
    return ({id: ExTreeBuilder.getNewId()} as unknown) as ts.Symbol;
  }
}
