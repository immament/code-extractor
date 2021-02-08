import ts from 'typescript';
import {CreateNodeArgs} from '../stubs/NodeStub';
import {TreeBuilder} from './TreeBuilder';

interface AddFromObjectArgs {
  kind?: ts.SyntaxKind;
  symbol?: number;
  childs?: AddFromObjectArgs[];
}

export class TreeBuilderWithSymbols extends TreeBuilder {
  private static lastId = 0;
  private static getNewId() {
    return ++this.lastId;
  }

  readonly #commonSymbols: ts.Symbol[];

  constructor(createNodeArgs?: CreateNodeArgs, symbolCounts = 5) {
    super(createNodeArgs);
    this.#commonSymbols = this.createSymbols(symbolCounts);
  }

  addChildWithSymbolAndGoTo(symbolIndex = 0) {
    return super.addChildAndGoTo({symbol: this.#commonSymbols[symbolIndex]});
  }

  addChildWithSymbol(symbolIndex = 0) {
    return super.addChild({symbol: this.#commonSymbols[symbolIndex]});
  }

  addChildAndGoTo(createNodeArgs: CreateNodeArgs = {}) {
    if (!createNodeArgs.symbol) {
      createNodeArgs.symbol = this.newSymbol();
    }
    return super.addChildAndGoTo(createNodeArgs);
  }

  addChild(createNodeArgs: CreateNodeArgs = {}) {
    if (!createNodeArgs.symbol) {
      createNodeArgs.symbol = this.newSymbol();
    } else {
      console.log('addChild createNodeArgs.symbol');
    }
    return super.addChild(createNodeArgs);
  }

  addFromObject(obj: AddFromObjectArgs) {
    return this.addChildAndGoTo(this.mapToCreateNodeArgs(obj));
  }

  getCommonSymbol(index: number): ts.Symbol {
    return this.#commonSymbols[index];
  }

  private createSymbols(symbolCounts: number) {
    return [...Array(symbolCounts)].map(() => this.newSymbol());
  }

  private mapToCreateNodeArgs({
    kind,
    symbol: symbolIndex,
    childs,
  }: AddFromObjectArgs): CreateNodeArgs {
    return {
      kind: kind,
      symbol: this.getCommonSymbolIfIndexDefined(symbolIndex),
      childs: childs?.map(childArgs =>
        this.newNode(this.mapToCreateNodeArgs(childArgs))
      ),
    };
  }

  private getCommonSymbolIfIndexDefined(index?: number): ts.Symbol | undefined {
    return index !== undefined ? this.getCommonSymbol(index) : undefined;
  }

  private newSymbol() {
    return ({id: TreeBuilderWithSymbols.getNewId()} as unknown) as ts.Symbol;
  }
}
