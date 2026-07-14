import {
  DanglingChainError,
  DanglingEdgeError,
  DuplicateChainNodeError,
  EmptyBoardError,
  EmptyChainError,
  InvalidChainBodyError,
  InvalidChainHeadError,
  MissingExitCellError,
  MixedPositionTypeError,
} from '../errors';
import { CellNode } from './cell-node';
import { Chain } from './chain';
import { Edge } from './edge';
import { EmptyCell } from './empty-cell';
import { ExitCell } from './exit-cell';
import { GridArrowCell } from './grid-arrow-cell';

export class Board {
  private readonly nodes: CellNode[];
  private readonly edges: Edge[];
  private readonly chains: Chain[];

  private constructor(nodes: CellNode[], edges: Edge[], chains: Chain[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.chains = chains;
  }

  static create(nodes: CellNode[], edges: Edge[], chains: Chain[]): Board {
    if (nodes.length === 0) {
      throw new EmptyBoardError('Board must contain at least one node.');
    }

    const positionCtor = nodes[0].getPosition().constructor;
    const hasMixedPositionTypes = nodes.some((node) => node.getPosition().constructor !== positionCtor);
    if (hasMixedPositionTypes) {
      throw new MixedPositionTypeError('All nodes must use the same position type.');
    }

    const hasExit = nodes.some((node) => node.getCellType() instanceof ExitCell);
    if (!hasExit) {
      throw new MissingExitCellError('Board must contain at least one exit cell.');
    }

    const nodeById = new Map<string, CellNode>(nodes.map((node) => [node.getId().getValue(), node]));

    const hasDanglingEdge = edges.some(
      (edge) => !nodeById.has(edge.getFrom().getValue()) || !nodeById.has(edge.getTo().getValue()),
    );
    if (hasDanglingEdge) {
      throw new DanglingEdgeError('All edges must reference existing node ids.');
    }

    Board.validateChains(chains, nodeById);

    return new Board(nodes, edges, chains);
  }

  private static validateChains(chains: Chain[], nodeById: Map<string, CellNode>): void {
    for (const chain of chains) {
      const nodeIds = chain.getNodeIds().map((id) => id.getValue());

      if (nodeIds.length === 0) {
        throw new EmptyChainError('A chain must contain at least one node.');
      }

      if (new Set(nodeIds).size !== nodeIds.length) {
        throw new DuplicateChainNodeError('A chain must not repeat a node id.');
      }

      const cellNodes = nodeIds.map((id) => {
        const node = nodeById.get(id);
        if (node === undefined) {
          throw new DanglingChainError('All chain node ids must reference existing nodes.');
        }
        return node;
      });

      const headIndex = cellNodes.length - 1;
      if (!(cellNodes[headIndex].getCellType() instanceof GridArrowCell)) {
        throw new InvalidChainHeadError('The head of a chain must be a grid_arrow cell.');
      }

      for (let i = 0; i < headIndex; i += 1) {
        if (!(cellNodes[i].getCellType() instanceof EmptyCell)) {
          throw new InvalidChainBodyError('The body of a chain must contain only empty cells.');
        }
      }
    }
  }

  getNodes(): CellNode[] {
    return [...this.nodes];
  }

  getEdges(): Edge[] {
    return [...this.edges];
  }

  getChains(): Chain[] {
    return [...this.chains];
  }
}
