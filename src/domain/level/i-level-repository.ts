import { Level } from './level.aggregate';
import { LevelId } from './value-objects/level-id';

export interface ILevelRepository {
  findById(id: LevelId): Promise<Level | null>;
  findAll(): Promise<Level[]>;
  save(level: Level): Promise<void>;
}
