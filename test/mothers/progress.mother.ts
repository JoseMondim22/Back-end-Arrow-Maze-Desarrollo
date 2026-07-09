import { LevelId } from '../../src/domain/level/value-objects/level-id';
import { Progress } from '../../src/domain/progress/progress.aggregate';
import { ProgressId } from '../../src/domain/progress/value-objects/progress-id';
import { Score } from '../../src/domain/progress/value-objects/score';
import { UserId } from '../../src/domain/user/value-objects/user-id';

export class ProgressMother {
  static aProgress(): Progress {
    return Progress.create(
      ProgressId.create('1'),
      UserId.create('111111111111'),
      LevelId.create('1'),
      Score.create(80),
    );
  }

  static withId(id: string): Progress {
    return Progress.create(
      ProgressId.create(id),
      UserId.create('111111111111'),
      LevelId.create('1'),
      Score.create(80),
    );
  }

  static withScore(userId: UserId, levelId: LevelId, score: number): Progress {
    return Progress.create(ProgressId.create('1'), userId, levelId, Score.create(score));
  }

  static reconstitutedWithId(id: string): Progress {
    return Progress.reconstitute(
      ProgressId.create(id),
      UserId.create('111111111111'),
      LevelId.create('1'),
      Score.create(80),
    );
  }
}
