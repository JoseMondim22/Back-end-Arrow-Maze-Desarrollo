import { ChainId } from './chain-id';
import { NodeId } from './node-id';

export class Chain {
  private readonly id: ChainId;
  private readonly nodeIds: NodeId[];

  private constructor(id: ChainId, nodeIds: NodeId[]) {
    this.id = id;
    this.nodeIds = nodeIds;
  }

  static create(id: ChainId, nodeIds: NodeId[]): Chain {
    return new Chain(id, nodeIds);
  }

  getId(): ChainId {
    return this.id;
  }

  getNodeIds(): NodeId[] {
    return [...this.nodeIds];
  }
}
