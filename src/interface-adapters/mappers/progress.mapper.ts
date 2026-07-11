import { Progress } from '../../domain/progress/progress.aggregate';
import { ProgressId } from '../../domain/progress/value-objects/progress-id';
import { Score } from '../../domain/progress/value-objects/score';
import { UserId } from '../../domain/user/value-objects/user-id';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { ProgressEntity } from '../entities/progress.entity';

export class ProgressMapper {
  static toDomain(entity: ProgressEntity): Progress {
    return Progress.reconstitute(
      ProgressId.create(entity.id),
      UserId.create(entity.userId),
      LevelId.create(entity.levelId),
      Score.create(entity.bestScore),
    );
  }

  static toEntity(progress: Progress): ProgressEntity {
    const entity = new ProgressEntity();
    entity.id = progress.getId().getValue();
    entity.userId = progress.getUserId().getValue();
    entity.levelId = progress.getLevelId().getValue();
    entity.bestScore = progress.getBestScore().getValue();
    return entity;
  }
}
