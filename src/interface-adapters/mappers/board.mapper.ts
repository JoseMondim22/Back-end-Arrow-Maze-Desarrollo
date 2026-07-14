import { Board } from '../../domain/level/value-objects/board';
import { CellNode } from '../../domain/level/value-objects/cell-node';
import { Chain } from '../../domain/level/value-objects/chain';
import { ChainId } from '../../domain/level/value-objects/chain-id';
import { Edge } from '../../domain/level/value-objects/edge';
import { NodeId } from '../../domain/level/value-objects/node-id';
import { GridPosition } from '../../domain/level/value-objects/grid-position';
import { GridPosition3D } from '../../domain/level/value-objects/grid-position-3d';
import { GridArrowCell } from '../../domain/level/value-objects/grid-arrow-cell';
import { GridDirection } from '../../domain/level/value-objects/grid-direction';
import { GridDirection3D } from '../../domain/level/value-objects/grid-direction-3d';
import { WallCell } from '../../domain/level/value-objects/wall-cell';
import { EmptyCell } from '../../domain/level/value-objects/empty-cell';
import { ExitCell } from '../../domain/level/value-objects/exit-cell';
import { CellFactory } from '../../domain/level/factories/cell.factory';
import { PositionFactory } from '../../domain/level/factories/position.factory';
import { UnknownCellTypeError, UnknownPositionTypeError } from '../../domain/level/errors';
import { NodeRawData } from '../dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../dtos/input/edge-raw-data.dto';
import { ChainRawData } from '../dtos/input/chain-raw-data.dto';

export class BoardMapper {
  static toDomain(nodes: NodeRawData[], edges: EdgeRawData[], chains: ChainRawData[] = []): Board {
    const cellNodes = nodes.map((raw) =>
      CellNode.create(
        NodeId.create(raw.id),
        PositionFactory.create({
          row: raw.row,
          column: raw.column,
          layer: raw.layer,
          positionType: raw.positionType,
        }),
        CellFactory.create({ type: raw.type, direction: raw.direction, positionType: raw.positionType }),
      ),
    );
    const cellEdges = edges.map((raw) => Edge.create(NodeId.create(raw.from), NodeId.create(raw.to)));
    const boardChains = (chains ?? []).map((raw) =>
      Chain.create(
        ChainId.create(raw.id),
        raw.nodeIds.map((nodeId) => NodeId.create(nodeId)),
      ),
    );

    return Board.create(cellNodes, cellEdges, boardChains);
  }

  static toRaw(board: Board): { nodes: NodeRawData[]; edges: EdgeRawData[]; chains: ChainRawData[] } {
    const nodes = board.getNodes().map((node) => {
      const { row, column, layer, positionType } = BoardMapper.serializePosition(node.getPosition());
      const { type, direction } = BoardMapper.serializeCellType(node.getCellType());
      return new NodeRawData(node.getId().getValue(), type, row, column, direction, layer, positionType);
    });

    const edges = board
      .getEdges()
      .map((edge) => new EdgeRawData(edge.getFrom().getValue(), edge.getTo().getValue()));

    const chains = board
      .getChains()
      .map((chain) => new ChainRawData(chain.getId().getValue(), chain.getNodeIds().map((id) => id.getValue())));

    return { nodes, edges, chains };
  }

  private static serializeCellType(cellType: unknown): { type: string; direction?: string } {
    if (cellType instanceof GridArrowCell) {
      const direction = cellType.getDirection();
      if (direction instanceof GridDirection3D || direction instanceof GridDirection) {
        return { type: 'grid_arrow', direction: direction.getValue() };
      }
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

  private static serializePosition(
    position: unknown,
  ): { row: number; column: number; layer?: number; positionType: string } {
    if (position instanceof GridPosition3D) {
      return {
        row: position.getRow(),
        column: position.getColumn(),
        layer: position.getLayer(),
        positionType: 'grid3d',
      };
    }
    if (position instanceof GridPosition) {
      return { row: position.getRow(), column: position.getColumn(), positionType: 'grid' };
    }
    throw new UnknownPositionTypeError('Cannot serialize unknown Position.');
  }
}
