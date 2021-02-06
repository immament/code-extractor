import {CreateNodeArgs, NodeStub} from './NodeStub';

export class TreeBuilder {
  private _current?: NodeStub;
  get current() {
    if (!this._current) {
      throw new TreeBuilderError('Builder not init (current undefined)');
    }
    return this._current;
  }
  private _root?: NodeStub;
  get root(): NodeStub | undefined {
    return this._root;
  }

  constructor(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this._root = this._current = this.newNode(createNodeArgs);
    }
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

    if (!this._root) {
      this._root = this._current;
    }
    return this;
  }

  private newNode(createNodeArgs: CreateNodeArgs): NodeStub {
    return new NodeStub({...createNodeArgs, parent: this._current});
  }

  addChild(createNodeArgs: CreateNodeArgs = {}) {
    if (!this.current) {
      throw new TreeBuilderError('Can not add child to empty tree');
    }
    this.current.addChild(this.newNode(createNodeArgs));
    return this;
  }

  up() {
    if (!this._current) {
      throw new TreeBuilderError(`Can not up in empty tree: ${this.current}`);
    }

    if (!this._current.parent) {
      throw new TreeBuilderError(`no parent for current node: ${this.current}`);
    }

    this._current = this._current.parent;

    return this;
  }

  toChild(childIndex = 0) {
    if (this.current.childs.length < childIndex) {
      throw new TreeBuilderError(
        `childIndex (${childIndex}) greater then childs count (${this.current.childs.length})`
      );
    }
    this._current = this._current?.childs[childIndex];
    return this;
  }

  getResult() {
    if (!this._root) {
      throw new TreeBuilderError('Builder not init (root undefined)');
    }
    return this._root.asNode();
  }

  reset(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this._root = this._current = new NodeStub({
        ...createNodeArgs,
        parent: undefined,
      });
    } else {
      this._root = this._current = undefined;
    }
    return this;
  }

  toRoot() {
    this._current = this._root;
    return this;
  }
}

export class TreeBuilderError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TreeBuilderError.prototype);
  }
}
