import {TreeBuilder, TreeBuilderError} from '../TreeBuilder';

describe(' TreeBuilder', () => {
  let builder: TreeBuilder;

  describe('create tree builder without parameters ', () => {
    beforeEach(() => {
      builder = new TreeBuilder();
    });

    describe('init state', () => {});

    test('should current throw Error after creation without parameters', () => {
      expect(() => builder.current).toThrow(TreeBuilderError);
    });

    test('should getResult throw Error after creation without parameters', () => {
      expect(() => builder.getResult()).toThrow(TreeBuilderError);
    });

    test('should property node throw Error after creation without parameters', () => {
      expect(() => builder.node).toThrow(TreeBuilderError);
    });

    test('should current node be defined  after creation with parameter', () => {
      expect(() => builder.node).toThrow(TreeBuilderError);
    });
  });

  describe('create tree builder with parameter', () => {
    beforeEach(() => {
      builder = new TreeBuilder({});
    });

    test('should current node be defined', () => {
      expect(builder.current).toBeTruthy();
      expect(builder.node).toBeTruthy();
    });

    test('should result be equals current', () => {
      expect(builder.getResult()).toBe(builder.current);
    });

    test('methods with fluent behavioure', () => {
      expect(builder.addChild()).toBe(builder);
      expect(builder.toChild()).toBe(builder);
      expect(builder.addLevel()).toBe(builder);
      expect(builder.up()).toBe(builder);
      expect(builder.reset({})).toBe(builder);
      expect(builder.toRoot()).toBe(builder);
    });
  });

  describe('without adding childs', () => {
    beforeEach(() => {
      builder = new TreeBuilder();
    });

    test('should return current node after add some', () => {
      builder.addLevel();

      expect(builder.current).toBeDefined();
    });

    test('should current node be diffrent after add two nodes', () => {
      builder.addLevel();
      const current1 = builder.current;
      builder.addLevel();
      expect(builder.current).not.toBe(current1);
    });

    test('should addlevel add new node to childs of current node', () => {
      builder.addLevel();
      const parent = builder.current;
      builder.addLevel();
      expect(parent.childs).toContain(builder.current);
    });
  });

  describe('child nodes', () => {
    beforeEach(() => {
      builder = new TreeBuilder({});
    });

    test('should current node be the same after add child', () => {
      const current1 = builder.current;
      builder.addChild();

      expect(builder.current).toBe(current1);
    });

    test('should child node parent be current node ', () => {
      builder.addChild();

      expect(builder.current.childs[0].parent).toBe(builder.current);
    });

    test('should current child counts be 0 before add child', () => {
      expect(builder.current?.getChildCount()).toBe(0);
    });

    test('should current child count be 2 after adds 2 childs', () => {
      builder.addChild().addChild();

      expect(builder.current?.getChildCount()).toBe(2);
    });

    test('should current child count be 0 after adds level', () => {
      builder.addChild().addChild().addLevel();

      expect(builder.current?.getChildCount()).toBe(0);
    });
  });

  describe('up', () => {
    beforeEach(() => {
      builder = new TreeBuilder();
    });

    test('should throw exception on first level', () => {
      expect(() => builder.up()).toThrow();
    });

    test('should current node be parent after use up ', () => {
      builder.addLevel();
      const parent = builder.current;
      builder.addLevel().up();

      expect(builder.current).toBe(parent);
    });
  });

  describe('root', () => {
    beforeEach(() => {
      builder = new TreeBuilder({});
    });
    test('should result be root node', () => {
      const root = builder.current;
      builder.addLevel().addChild().addLevel();
      expect(builder.getResult()).toBe(root);
    });

    test('should reset create new root node without childs and undefined parent', () => {
      const oldRoot = builder.getResult();
      builder.addLevel().addChild().addLevel();
      builder.reset({});

      const result = builder.getResult();
      expect(result).not.toBe(oldRoot);
      expect(result).toBe(builder.current);
      expect(result.getChildCount()).toBe(0);
      expect(result.parent).toBeUndefined();
    });

    test('should set current to root ', () => {
      const root = builder.getResult();
      builder.addLevel().addChild().addLevel().addLevel();
      builder.toRoot();

      expect(builder.current).toBe(root);
      expect(builder.getResult()).toBe(root);
    });

    test('should root return result as NodeStub', () => {
      expect(builder.root).toBe(builder.getResult());
    });
  });

  describe('toChild', () => {
    beforeEach(() => {
      builder = new TreeBuilder({});
    });
    test('should change current to child with specified index', () => {
      builder.addChild().addChild().addChild().toChild(2);
      expect(builder.current).toBe(builder.root?.childs[2]);
    });

    test('should use out of range index throw exception', () => {
      builder.addChild().addChild().addChild();
      expect(() => builder.toChild(5)).toThrow(TreeBuilderError);
    });
  });
});
