import { Level } from '../../domain/level/level.aggregate';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { LevelOrder } from '../../domain/level/value-objects/level-order';
import { LevelRules } from '../../domain/level/value-objects/level-rules';
import { LevelEntity } from '../entities/level.entity';
import { BoardMapper } from './board.mapper';

export class LevelMapper {
  static toDomain(entity: LevelEntity): Level {
    return Level.reconstitute(
      LevelId.create(entity.id),
      BoardMapper.toDomain(entity.boardData.nodes, entity.boardData.edges),
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
    const rules = level.getRules();

    const entity = new LevelEntity();
    entity.id = level.getId().getValue();
    entity.boardData = BoardMapper.toRaw(level.getBoard());
    entity.timeLimit = rules.getTimeLimit();
    entity.maxMoves = rules.getMaxMoves();
    entity.maxPossibleScore = rules.getMaxPossibleScore();
    entity.difficulty = rules.getDifficulty();
    entity.order = level.getOrder().getValue();
    return entity;
  }
}
