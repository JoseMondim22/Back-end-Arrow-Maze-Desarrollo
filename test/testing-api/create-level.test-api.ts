import { CreateLevelUseCase } from '../../src/application/use-cases/create-level.use-case';
import { CreateLevelCommand } from '../../src/application/commands/create-level.command';
import { IIdGenerator } from '../../src/application/ports/id-generator';
import { InMemoryLevelRepository } from '../in-memory/in-memory-level.repository';

const GENERATED_ID = '444444444444';

export class CreateLevelTestAPI {
  private readonly levelRepository = new InMemoryLevelRepository();
  private readonly idGenerator: IIdGenerator = {
    generate: jest.fn().mockReturnValue(GENERATED_ID),
  };
  private thrownError: Error | null = null;

  async whenCreatingLevel(command: CreateLevelCommand): Promise<void> {
    const useCase = new CreateLevelUseCase(this.levelRepository, this.idGenerator);

    try {
      await useCase.execute(command);
    } catch (error) {
      this.thrownError = error as Error;
    }
  }

  thenLevelShouldBeSavedWithOrder(expectedOrder: number): void {
    const savedLevel = this.levelRepository.getSavedLevels()[0];
    expect(savedLevel).toBeDefined();
    expect(savedLevel.getOrder().getValue()).toBe(expectedOrder);
  }

  thenSavedLevelShouldHaveGeneratedId(): void {
    const savedLevel = this.levelRepository.getSavedLevels()[0];
    expect(savedLevel.getId().getValue()).toBe(GENERATED_ID);
  }

  thenSavedLevelShouldHaveNodeCount(expectedCount: number): void {
    const savedLevel = this.levelRepository.getSavedLevels()[0];
    expect(savedLevel.getBoard().getNodes()).toHaveLength(expectedCount);
  }

  thenNoLevelShouldBeSaved(): void {
    expect(this.levelRepository.getSavedLevels()).toHaveLength(0);
  }

  thenShouldFailWith(errorClass: new (...args: never[]) => Error): void {
    expect(this.thrownError).toBeInstanceOf(errorClass);
  }
}
