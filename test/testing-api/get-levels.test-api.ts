import { GetLevelsUseCase } from '../../src/application/use-cases/get-levels.use-case';
import { GetLevelsQuery } from '../../src/application/queries/get-levels.query';
import { Level } from '../../src/domain/level/level.aggregate';
import { InMemoryLevelRepository } from '../in-memory/in-memory-level.repository';
import { LevelMother } from '../mothers/level.mother';

export class GetLevelsTestAPI {
  private readonly levelRepository = new InMemoryLevelRepository();
  private result: Level[] = [];

  givenExistingLevelWithId(id: string): void {
    this.levelRepository.seed(LevelMother.withId(id));
  }

  givenNoExistingLevels(): void {
    // default state: repository starts empty
  }

  async whenGettingLevels(): Promise<void> {
    const useCase = new GetLevelsUseCase(this.levelRepository);
    this.result = await useCase.execute(new GetLevelsQuery());
  }

  thenShouldReturnLevelCount(expectedCount: number): void {
    expect(this.result).toHaveLength(expectedCount);
  }

  thenShouldReturnLevelWithId(id: string): void {
    const level = this.result.find((l) => l.getId().getValue() === id);
    expect(level).toBeDefined();
  }
}
