import { Progress } from './progress.aggregate';
import { LevelId } from '../level/value-objects/level-id';
import { UserId } from '../user/value-objects/user-id';

export interface IProgressRepository {
  findByUserAndLevel(userId: UserId, levelId: LevelId): Promise<Progress | null>;
  findTopScoresByLevel(levelId: LevelId, limit: number): Promise<Progress[]>;
  save(progress: Progress): Promise<void>;
}
