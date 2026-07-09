import { LevelId } from '../level/value-objects/level-id';
import { UserId } from '../user/value-objects/user-id';
import { ProgressId } from './value-objects/progress-id';
import { Score } from './value-objects/score';

export class Progress {
  private readonly id: ProgressId;
  private readonly userId: UserId;
  private readonly levelId: LevelId;
  private bestScore: Score;

  private constructor(id: ProgressId, userId: UserId, levelId: LevelId, bestScore: Score) {
    this.id = id;
    this.userId = userId;
    this.levelId = levelId;
    this.bestScore = bestScore;
  }

  static create(id: ProgressId, userId: UserId, levelId: LevelId, score: Score): Progress {
    return new Progress(id, userId, levelId, score);
  }

  static reconstitute(id: ProgressId, userId: UserId, levelId: LevelId, bestScore: Score): Progress {
    return new Progress(id, userId, levelId, bestScore);
  }

  registerAttempt(score: Score): void {
    if (score.isHigherThan(this.bestScore)) {
      this.bestScore = score;
    }
  }

  getId(): ProgressId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getLevelId(): LevelId {
    return this.levelId;
  }

  getBestScore(): Score {
    return this.bestScore;
  }
}
