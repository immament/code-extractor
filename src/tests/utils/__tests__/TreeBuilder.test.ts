import {TreeBuilder, TreeBuilderError} from '../TreeBuilder';

describe('TreeBuilder', () => {
  let builder: TreeBuilder;

  describe('create tree builder without parameters ', () => {
    beforeEach(() => {
      builder = new TreeBuilder();
    });

    test('should current throw Error after creation without parameters', () => {
      expect(() => builder.current).toThrow(TreeBuilderError);
    });

    test('should getResult throw Error after creation without parameters', () => {
      expect(() => builder.getResult()).toThrow(TreeBuilderError);
    });

    test('should property node throw Error after creation without parameters', () => {
      expect(() => builder.currentAsNode).toThrow(TreeBuilderError);
    });

    test('should current node be defined  after creation with parameter', () => {
      expect(() => builder.currentAsNode).toThrow(TreeBuilderError);
    });
  });

  describe('create tree builder with parameter', () => {
    beforeEach(() => {
      builder = new TreeBuilder({});
    });

    test('should current node be defined', () => {
      expect(builder.current).toBeTruthy();
      expect(builder.currentAsNode).toBeTruthy();
    });

    test('should result be equals current', () => {
      expect(builder.getResult()).toBe(builder.current);
    });

    test('methods with fluent behaviour', () => {
      expect(builder.addChild()).toBe(builder);
      expect(builder.toChild()).toBe(builder);
      expect(builder.addChildAndGoTo()).toBe(builder);
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
      builder.addChildAndGoTo();

      expect(builder.current).toBeDefined();
    });

    test('should current node be diffrent after add two nodes', () => {
      builder.addChildAndGoTo();
      const current1 = builder.current;
      builder.addChildAndGoTo();
      expect(builder.current).not.toBe(current1);
    });

    test('should addlevel add new node to childs of current node', () => {
      builder.addChildAndGoTo();
      const parent = builder.current;
      builder.addChildAndGoTo();
      expect(parent.getChildren()).toContain(builder.current);
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

      expect(builder.current.getChild(0).parent).toBe(builder.current);
    });

    test('should current child counts be 0 before add child', () => {
      expect(builder.current?.getChildCount()).toBe(0);
    });

    test('should current child count be 2 after adds 2 childs', () => {
      builder.addChild().addChild();

      expect(builder.current?.getChildCount()).toBe(2);
    });

    test('should current child count be 0 after adds level', () => {
      builder.addChild().addChild().addChildAndGoTo();

      expect(builder.current?.getChildCount()).toBe(0);
    });
  });

  describe('up', () => {
    beforeEach(() => {
      builder = new TreeBuilder();
    });

    test('should throw exception on first level', () => {
      expect(() => builder.addChildAndGoTo().up()).toThrow(TreeBuilderError);
    });

    test('should throw exception if not nodes in tree', () => {
      expect(() => builder.up()).toThrow(TreeBuilderError);
    });

    test('should current node be parent after use up ', () => {
      builder.addChildAndGoTo();
      const parent = builder.current;
      builder.addChildAndGoTo().up();

      expect(builder.current).toBe(parent);
    });
  });

  describe('root', () => {
    beforeEach(() => {
      builder = new TreeBuilder({});
    });
    test('should result be root node', () => {
      const root = builder.current;
      builder.addChildAndGoTo().addChild().addChildAndGoTo();
      expect(builder.getResult()).toBe(root);
    });

    test('should reset create new root node without childs and undefined parent', () => {
      builder.addChildAndGoTo().addChild().addChildAndGoTo();
      const oldRoot = builder.getResult();
      builder.reset({});

      const root = builder.root!;
      expect(root).not.toBe(oldRoot);
      expect(root).toBe(builder.current);
      expect(root.getChildCount()).toBe(0);
      expect(root.parent).toBeUndefined();
    });

    test('should root and current be undefined after reset without args', () => {
      builder.addChildAndGoTo().addChild().addChildAndGoTo();
      builder.reset();

      expect(builder.root).toBeUndefined();
      expect(() => builder.current).toThrowErrorMatchingInlineSnapshot(
        '"Builder not init (current undefined)"'
      );
    });

    test('should set current to root ', () => {
      const root = builder.getResult();
      builder.addChildAndGoTo().addChild().addChildAndGoTo().addChildAndGoTo();
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
      const childIndex = 2;
      builder.addChild().addChild().addChild().toChild(childIndex);
      expect(builder.current).toBe(builder.root?.getChild(childIndex));
    });

    test('should use out of range index throw exception', () => {
      builder.addChild().addChild().addChild();
      expect(() => builder.toChild(5)).toThrow(TreeBuilderError);
    });
  });
});
