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

  private newNode(createNodeArgs: CreateNodeArgs): NodeStub {
    return new NodeStub({...createNodeArgs, parent: this.#currentNode});
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
    const currentChilds = this.current.childs;
    if (currentChilds.length < childIndex) {
      throw new TreeBuilderError(
        `childIndex (${childIndex}) greater then childs count (${currentChilds.length})`
      );
    }
    this.#currentNode = currentChilds[childIndex];
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
}

export class TreeBuilderError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TreeBuilderError.prototype);
  }
}
