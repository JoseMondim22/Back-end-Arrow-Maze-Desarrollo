import { Board } from '../../domain/level/value-objects/board';
import { CellNode } from '../../domain/level/value-objects/cell-node';
import { Edge } from '../../domain/level/value-objects/edge';
import { NodeId } from '../../domain/level/value-objects/node-id';
import { GridPosition } from '../../domain/level/value-objects/grid-position';
import { GridArrowCell } from '../../domain/level/value-objects/grid-arrow-cell';
import { GridDirection } from '../../domain/level/value-objects/grid-direction';
import { WallCell } from '../../domain/level/value-objects/wall-cell';
import { EmptyCell } from '../../domain/level/value-objects/empty-cell';
import { ExitCell } from '../../domain/level/value-objects/exit-cell';
import { CellFactory } from '../../domain/level/factories/cell.factory';
import { UnknownCellTypeError } from '../../domain/level/errors';
import { NodeRawData } from '../dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../dtos/input/edge-raw-data.dto';

export class BoardMapper {
  static toDomain(nodes: NodeRawData[], edges: EdgeRawData[]): Board {
    const cellNodes = nodes.map((raw) =>
      CellNode.create(
        NodeId.create(raw.id),
        GridPosition.create(raw.row, raw.column),
        CellFactory.create({ type: raw.type, direction: raw.direction }),
      ),
    );
    const cellEdges = edges.map((raw) => Edge.create(NodeId.create(raw.from), NodeId.create(raw.to)));

    return Board.create(cellNodes, cellEdges);
  }

  static toRaw(board: Board): { nodes: NodeRawData[]; edges: EdgeRawData[] } {
    const nodes = board.getNodes().map((node) => {
      const position = node.getPosition() as GridPosition;
      const { type, direction } = BoardMapper.serializeCellType(node.getCellType());
      return new NodeRawData(node.getId().getValue(), type, position.getRow(), position.getColumn(), direction);
    });

    const edges = board
      .getEdges()
      .map((edge) => new EdgeRawData(edge.getFrom().getValue(), edge.getTo().getValue()));

    return { nodes, edges };
  }

  private static serializeCellType(cellType: unknown): { type: string; direction?: string } {
    if (cellType instanceof GridArrowCell) {
      const direction = cellType.getDirection() as GridDirection;
      return { type: 'grid_arrow', direction: direction.getValue() };
    }
    if (cellType instanceof WallCell) {
      return { type: 'wall' };
    }
    if (cellType instanceof EmptyCell) {
      return { type: 'empty' };
    }
    if (cellType instanceof ExitCell) {
      return { type: 'exit' };
    }
    throw new UnknownCellTypeError('Cannot serialize unknown CellType.');
  }
}
