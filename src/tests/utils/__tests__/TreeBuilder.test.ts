import {TreeBuilder} from '../TreeBuilder';

describe(' TreeBuilder', () => {
  let treeBuilder: TreeBuilder;

  describe('create tree builder without parameters ', () => {
    beforeEach(() => {
      treeBuilder = new TreeBuilder();
    });

    describe('init state', () => {});

    test('should current throw Error after creation without parameters', () => {
      expect(() => treeBuilder.current).toThrow();
    });

    test('should getResult throw Error after creation without parameters', () => {
      expect(() => treeBuilder.getResult()).toThrow();
    });

    test('should property node throw Error after creation without parameters', () => {
      expect(() => treeBuilder.node).toThrow();
    });

    test('should current node be defined  after creation with parameter', () => {
      expect(() => treeBuilder.node).toThrow();
    });
  });

  describe('create tree builder with parameter', () => {
    beforeEach(() => {
      treeBuilder = new TreeBuilder({});
    });

    test('should current node be defined', () => {
      expect(treeBuilder.current).toBeTruthy();
      expect(treeBuilder.node).toBeTruthy();
    });

    test('should result be equals current', () => {
      expect(treeBuilder.getResult()).toBe(treeBuilder.current);
    });

    test('methods with fluent behavioure', () => {
      expect(treeBuilder.addChild()).toBe(treeBuilder);
      expect(treeBuilder.addLevel()).toBe(treeBuilder);
      expect(treeBuilder.up()).toBe(treeBuilder);
      expect(treeBuilder.reset({})).toBe(treeBuilder);
      expect(treeBuilder.toRoot()).toBe(treeBuilder);
    });
  });

  describe('without adding childs', () => {
    beforeEach(() => {
      treeBuilder = new TreeBuilder();
    });

    test('should return current node after add some', () => {
      treeBuilder.addLevel();

      expect(treeBuilder.current).toBeDefined();
    });

    test('should current node be diffrent after add two nodes', () => {
      treeBuilder.addLevel();
      const current1 = treeBuilder.current;
      treeBuilder.addLevel();
      expect(treeBuilder.current).not.toBe(current1);
    });

    test('should addlevel add new node to childs of current node', () => {
      treeBuilder.addLevel();
      const parent = treeBuilder.current;
      treeBuilder.addLevel();
      expect(parent.childs).toContain(treeBuilder.current);
    });
  });

  describe('child nodes', () => {
    beforeEach(() => {
      treeBuilder = new TreeBuilder({});
    });

    test('should current node be the same after add child', () => {
      const current1 = treeBuilder.current;
      treeBuilder.addChild();

      expect(treeBuilder.current).toBe(current1);
    });

    test('should child node parent be current node ', () => {
      treeBuilder.addChild();

      expect(treeBuilder.current.childs[0].parent).toBe(treeBuilder.current);
    });

    test('should current child counts be 0 before add child', () => {
      expect(treeBuilder.current?.getChildCount()).toBe(0);
    });

    test('should current child count be 2 after adds 2 childs', () => {
      treeBuilder.addChild().addChild();

      expect(treeBuilder.current?.getChildCount()).toBe(2);
    });

    test('should current child count be 0 after adds level', () => {
      treeBuilder.addChild().addChild().addLevel();

      expect(treeBuilder.current?.getChildCount()).toBe(0);
    });
  });

  describe('up', () => {
    beforeEach(() => {
      treeBuilder = new TreeBuilder();
    });

    test('should throw exception on first level', () => {
      expect(() => treeBuilder.up()).toThrow();
    });

    test('should current node be parent after use up ', () => {
      treeBuilder.addLevel();
      const parent = treeBuilder.current;
      treeBuilder.addLevel().up();

      expect(treeBuilder.current).toBe(parent);
    });
  });

  describe('root', () => {
    beforeEach(() => {
      treeBuilder = new TreeBuilder({});
    });
    test('should result be root node', () => {
      const root = treeBuilder.current;
      treeBuilder.addLevel().addChild().addLevel();
      expect(treeBuilder.getResult()).toBe(root);
    });

    test('should reset create new root node without childs and undefined parent', () => {
      const oldRoot = treeBuilder.getResult();
      treeBuilder.addLevel().addChild().addLevel();
      treeBuilder.reset({});

      const result = treeBuilder.getResult();
      expect(result).not.toBe(oldRoot);
      expect(result).toBe(treeBuilder.current);
      expect(result.getChildCount()).toBe(0);
      expect(result.parent).toBeUndefined();
    });

    test('should  set current to root ', () => {
      const root = treeBuilder.getResult();
      treeBuilder.addLevel().addChild().addLevel().addLevel();
      treeBuilder.toRoot();

      expect(treeBuilder.current).toBe(root);
      expect(treeBuilder.getResult()).toBe(root);
    });
  });
});
