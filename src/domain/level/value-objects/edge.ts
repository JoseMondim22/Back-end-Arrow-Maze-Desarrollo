import { NodeId } from './node-id';

export class Edge {
  private readonly from: NodeId;
  private readonly to: NodeId;

  private constructor(from: NodeId, to: NodeId) {
    this.from = from;
    this.to = to;
  }

  static create(from: NodeId, to: NodeId): Edge {
    return new Edge(from, to);
  }

  getFrom(): NodeId {
    return this.from;
  }

  getTo(): NodeId {
    return this.to;
  }
}
