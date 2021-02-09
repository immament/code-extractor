import {CreateNodeArgs, NodeStub} from '../stubs/NodeStub';

export class TreeBuilder {
  #currentNode?: NodeStub;
  #root?: NodeStub;

  get current() {
    if (this.#currentNode) return this.#currentNode;
    throw new TreeBuilderError('Builder not init (current undefined)');
  }
  get root(): NodeStub | undefined {
    return this.#root;
  }

  constructor(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this.#root = this.#currentNode = this.newNode(createNodeArgs);
    }
  }

  get currentAsNode() {
    return this.current.asNode();
  }

  addChildAndGoTo(createNodeArgs: CreateNodeArgs = {}) {
    const oldCurrent = this.#currentNode;
    const newNode = this.newNode(createNodeArgs);
    if (oldCurrent) {
      oldCurrent.addChild(newNode);
    }

    this.#currentNode = newNode;
    this.#root ??= this.#currentNode;

    return this;
  }

  addChild(createNodeArgs: CreateNodeArgs = {}) {
    this.current.addChild(this.newNode(createNodeArgs));
    return this;
  }

  up() {
    if (!this.current.parent) {
      throw new TreeBuilderError(
        `Can not move current. No parent for current node: ${this.current}`
      );
    }

    this.#currentNode = this.current.parent;

    return this;
  }

  toChild(childIndex = 0) {
    const child = this.current.getChild(childIndex);
    if (child) {
      this.#currentNode = child;
      return this;
    }

    throw new TreeBuilderError(
      `No child with specific index (${childIndex}) (${this.current.getChildCount()})`
    );
  }

  getResult() {
    return this.getResultStub().asNode();
  }

  getResultStub() {
    if (!this.#root) {
      throw new TreeBuilderError('Builder not init (root undefined)');
    }
    return this.#root;
  }

  reset(createNodeArgs?: CreateNodeArgs) {
    if (createNodeArgs) {
      this.#root = this.#currentNode = new NodeStub({
        ...createNodeArgs,
        parent: undefined,
      });
    } else {
      this.#root = this.#currentNode = undefined;
    }
    return this;
  }

  toRoot() {
    this.#currentNode = this.#root;
    return this;
  }

  protected newNode(createNodeArgs: CreateNodeArgs): NodeStub {
    return new NodeStub({...createNodeArgs, parent: this.#currentNode});
  }
}

export class TreeBuilderError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TreeBuilderError.prototype);
  }
}
