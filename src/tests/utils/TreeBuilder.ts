import {CreateNodeArgs, NodeStub} from '../stubs/NodeStub';

export class TreeBuilder {
  #current?: NodeStub;
  #root?: NodeStub;

  get current() {
    if (this.#current) return this.#current;
    throw new TreeBuilderError('Builder not init (current undefined)');
  }
  get root(): NodeStub | undefined {
    return this.#root;
  }

  constructor(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this.#root = this.#current = this.newNode(createNodeArgs);
    }
  }

  get node() {
    return this.current.asNode();
  }

  addLevel(createNodeArgs: CreateNodeArgs = {}) {
    const oldCurrent = this.#current;
    this.#current = this.newNode(createNodeArgs);
    if (oldCurrent) {
      oldCurrent.addChild(this.#current);
    }

    if (!this.#root) {
      this.#root = this.#current;
    }
    return this;
  }

  private newNode(createNodeArgs: CreateNodeArgs): NodeStub {
    return new NodeStub({...createNodeArgs, parent: this.#current});
  }

  addChild(createNodeArgs: CreateNodeArgs = {}) {
    if (!this.current) {
      throw new TreeBuilderError('Can not add child to empty tree');
    }
    this.current.addChild(this.newNode(createNodeArgs));
    return this;
  }

  up() {
    if (!this.#current) {
      throw new TreeBuilderError(`Can not up in empty tree: ${this.current}`);
    }

    if (!this.#current.parent) {
      throw new TreeBuilderError(`no parent for current node: ${this.current}`);
    }

    this.#current = this.#current.parent;

    return this;
  }

  toChild(childIndex = 0) {
    if (this.current.childs.length < childIndex) {
      throw new TreeBuilderError(
        `childIndex (${childIndex}) greater then childs count (${this.current.childs.length})`
      );
    }
    this.#current = this.#current?.childs[childIndex];
    return this;
  }

  getResult() {
    if (!this.#root) {
      throw new TreeBuilderError('Builder not init (root undefined)');
    }
    return this.#root.asNode();
  }

  reset(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this.#root = this.#current = new NodeStub({
        ...createNodeArgs,
        parent: undefined,
      });
    } else {
      this.#root = this.#current = undefined;
    }
    return this;
  }

  toRoot() {
    this.#current = this.#root;
    return this;
  }
}

export class TreeBuilderError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TreeBuilderError.prototype);
  }
}
