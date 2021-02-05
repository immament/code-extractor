import {CreateNodeArgs, NodeStub} from './NodeStub';

export class TreeBuilder {
  private _current?: NodeStub;
  private root?: NodeStub;

  constructor(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this.root = this._current = this.newNode(createNodeArgs);
    }
  }

  get current() {
    if (!this._current) {
      throw Error('Builder not init (current undefined)');
    }
    return this._current;
  }

  get node() {
    return this.current.asNode();
  }

  addLevel(createNodeArgs: CreateNodeArgs = {}) {
    const oldCurrent = this._current;
    this._current = this.newNode(createNodeArgs);
    if (oldCurrent) {
      oldCurrent.addChild(this._current);
    }

    if (!this.root) {
      this.root = this._current;
    }
    return this;
  }

  private newNode(createNodeArgs: CreateNodeArgs): NodeStub {
    return new NodeStub({...createNodeArgs, parent: this._current});
  }

  addChild(createNodeArgs: CreateNodeArgs = {}) {
    if (!this.current) {
      throw Error('Can not add child to empty tree');
    }
    this.current.addChild(this.newNode(createNodeArgs));
    return this;
  }

  up() {
    if (!this._current) {
      throw new Error(`Can not up in empty tree: ${this.current}`);
    }

    if (!this._current.parent) {
      throw new Error(`no parent for current node: ${this.current}`);
    }

    this._current = this._current.parent;

    return this;
  }

  getResult() {
    if (!this.root) {
      throw Error('Builder not init (root undefined)');
    }
    return this.root.asNode();
  }

  reset(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this.root = this._current = new NodeStub({
        ...createNodeArgs,
        parent: undefined,
      });
    } else {
      this.root = this._current = undefined;
    }
    return this;
  }

  toRoot() {
    this._current = this.root;
    return this;
  }
}
