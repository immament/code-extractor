import {ClassDeclaration} from '../compiler/domain/ClassDeclaration';
import {InterfaceDeclaration} from '../compiler/domain/InterfaceDeclaration';
import {Node} from '../compiler/domain/Node';
import {NodeKind} from '../compiler/domain/SyntaxKind';
import {TypeChecker} from '../compiler/domain/TypeChecker';
import {FoundNode} from './model/FoundNode';
import {ReferenceSearcherContext} from './ReferenceSearcherContext';

export class ReferenceSearcher {
  private searchInKind: Partial<Record<NodeKind, SearchIn>> = {
    [NodeKind.ClassDeclaration]: new SearchInClass(),
    [NodeKind.InterfaceDeclaration]: new SearchInInterface(),
  };

  constructor(private typeChecker: TypeChecker) {}

  search(items: FoundNode[]) {
    const context = this.createContext(items);
    return context.hasItemsToFound()
      ? this.searchInsideItems(items, context)
      : [];
  }

  private createContext(items: FoundNode[]) {
    return new ReferenceSearcherContext(items);
  }

  private searchInsideItems(
    items: FoundNode[],
    context: ReferenceSearcherContext
  ) {
    items.forEach(item => {
      this.searchInsideItem(context, item);
    });

    return context.getResult();
  }

  private searchInsideItem(context: ReferenceSearcherContext, item: FoundNode) {
    context.setCurrentFoundNode(item);
    const node = item.getNode();

    const searchInStrategy = this.searchInKind[node.kind];
    if (searchInStrategy) {
      const childs = searchInStrategy.search(context, node);
      childs.forEach(m => this.searchInsideNode(m, context));
    } else {
      this.searchInsideNode(node, context);
    }
  }

  private searchInsideNode(node: Node, context: ReferenceSearcherContext) {
    node.forEachChild(child => {
      context.addIfIsConncetedItem(child, 'Use');
      this.searchInsideNode(child, context);
      return undefined;
    });
  }
}

export class ReferenceSearcherError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceSearcherError.prototype);
  }
}

export interface SearchIn {
  search(context: ReferenceSearcherContext, node: Node): Node[];
}

class SearchInInterface implements SearchIn {
  search(context: ReferenceSearcherContext, node: InterfaceDeclaration) {
    const extended = node.getExtends();
    if (extended) {
      context.addIfIsConncetedItem(extended, 'Extends');
    }

    return node.getMembers();
  }
}

class SearchInClass implements SearchIn {
  search(context: ReferenceSearcherContext, node: ClassDeclaration) {
    const baseClass = node.getBaseClass();
    if (baseClass) {
      context.addIfIsConncetedItem(baseClass, 'Extends');
    }

    const implementedNodes = node.getImplements();
    implementedNodes.forEach(n => {
      context.addIfIsConncetedItem(n, 'Implements');
    });

    return node.getMembers();
  }
}
