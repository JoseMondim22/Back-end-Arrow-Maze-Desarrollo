import { DanglingEdgeError, EmptyBoardError, MissingExitCellError, MultipleExitCellsError } from '../errors';
import { CellNode } from './cell-node';
import { Edge } from './edge';
import { ExitCell } from './exit-cell';

export class Board {
  private readonly nodes: CellNode[];
  private readonly edges: Edge[];

  private constructor(nodes: CellNode[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  static create(nodes: CellNode[], edges: Edge[]): Board {
    if (nodes.length === 0) {
      throw new EmptyBoardError('Board must contain at least one node.');
    }

    const exitCount = nodes.filter((node) => node.getCellType() instanceof ExitCell).length;
    if (exitCount === 0) {
      throw new MissingExitCellError('Board must contain exactly one exit cell.');
    }
    if (exitCount > 1) {
      throw new MultipleExitCellsError('Board must contain exactly one exit cell.');
    }

    const nodeIds = new Set(nodes.map((node) => node.getId().getValue()));
    const hasDanglingEdge = edges.some(
      (edge) => !nodeIds.has(edge.getFrom().getValue()) || !nodeIds.has(edge.getTo().getValue()),
    );
    if (hasDanglingEdge) {
      throw new DanglingEdgeError('All edges must reference existing node ids.');
    }

    return new Board(nodes, edges);
  }

  getNodes(): CellNode[] {
    return [...this.nodes];
  }

  getEdges(): Edge[] {
    return [...this.edges];
  }
}
