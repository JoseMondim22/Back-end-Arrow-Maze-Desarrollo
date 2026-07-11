import { Level } from '../../domain/level/level.aggregate';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { LevelOrder } from '../../domain/level/value-objects/level-order';
import { LevelRules } from '../../domain/level/value-objects/level-rules';
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
import { LevelEntity, BoardNodeData, BoardEdgeData } from '../entities/level.entity';

export class LevelMapper {
  static toDomain(entity: LevelEntity): Level {
    const nodes = entity.boardData.nodes.map((raw) =>
      CellNode.create(
        NodeId.create(raw.id),
        GridPosition.create(raw.row, raw.column),
        CellFactory.create({ type: raw.type, direction: raw.direction }),
      ),
    );
    const edges = entity.boardData.edges.map((raw) =>
      Edge.create(NodeId.create(raw.from), NodeId.create(raw.to)),
    );

    return Level.reconstitute(
      LevelId.create(entity.id),
      Board.create(nodes, edges),
      LevelRules.create(
        entity.timeLimit,
        entity.maxMoves,
        entity.maxPossibleScore,
        entity.difficulty,
      ),
      LevelOrder.create(entity.order),
    );
  }

  static toEntity(level: Level): LevelEntity {
    const board = level.getBoard();
    const rules = level.getRules();

    const nodes: BoardNodeData[] = board.getNodes().map((node) => {
      const position = node.getPosition() as GridPosition;
      const cellType = node.getCellType();

      return {
        id: node.getId().getValue(),
        row: position.getRow(),
        column: position.getColumn(),
        ...LevelMapper.serializeCellType(cellType),
      };
    });

    const edges: BoardEdgeData[] = board.getEdges().map((edge) => ({
      from: edge.getFrom().getValue(),
      to: edge.getTo().getValue(),
    }));

    const entity = new LevelEntity();
    entity.id = level.getId().getValue();
    entity.boardData = { nodes, edges };
    entity.timeLimit = rules.getTimeLimit();
    entity.maxMoves = rules.getMaxMoves();
    entity.maxPossibleScore = rules.getMaxPossibleScore();
    entity.difficulty = rules.getDifficulty();
    entity.order = level.getOrder().getValue();
    return entity;
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
