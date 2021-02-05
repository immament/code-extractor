import {ExportedNode} from './ExportedNode';
import {TsNode} from './Node';

export class NodeExporter {
  export(node: TsNode) {
    return {kind: node.getKind()} as ExportedNode;
  }
}
