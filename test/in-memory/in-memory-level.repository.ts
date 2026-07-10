import { ILevelRepository } from '../../src/domain/level/i-level-repository';
import { Level } from '../../src/domain/level/level.aggregate';
import { LevelId } from '../../src/domain/level/value-objects/level-id';

export class InMemoryLevelRepository implements ILevelRepository {
  private readonly seededLevels: Level[] = [];
  private readonly savedLevels: Level[] = [];

  async findById(id: LevelId): Promise<Level | null> {
    return this.allLevels().find((level) => level.getId().equals(id)) ?? null;
  }

  async findAll(): Promise<Level[]> {
    return this.allLevels();
  }

  async save(level: Level): Promise<void> {
    this.savedLevels.push(level);
  }

  seed(level: Level): void {
    this.seededLevels.push(level);
  }

  getSavedLevels(): Level[] {
    return this.savedLevels;
  }

  private allLevels(): Level[] {
    return [...this.seededLevels, ...this.savedLevels];
  }
}
