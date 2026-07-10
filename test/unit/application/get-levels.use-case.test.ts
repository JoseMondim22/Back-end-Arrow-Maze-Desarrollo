import { GetLevelsTestAPI } from '../../testing-api/get-levels.test-api';

describe('GetLevelsUseCase', () => {
  it('should_return_empty_list_when_no_levels_exist', async () => {
    // Arrange
    const api = new GetLevelsTestAPI();
    api.givenNoExistingLevels();

    // Act
    await api.whenGettingLevels();

    // Assert
    api.thenShouldReturnLevelCount(0);
  });

  it('should_return_all_levels_when_levels_exist', async () => {
    // Arrange
    const api = new GetLevelsTestAPI();
    api.givenExistingLevelWithId('1');
    api.givenExistingLevelWithId('2');

    // Act
    await api.whenGettingLevels();

    // Assert
    api.thenShouldReturnLevelCount(2);
  });

  it('should_return_levels_matching_seeded_ids_when_levels_exist', async () => {
    // Arrange
    const api = new GetLevelsTestAPI();
    api.givenExistingLevelWithId('1');
    api.givenExistingLevelWithId('2');

    // Act
    await api.whenGettingLevels();

    // Assert
    api.thenShouldReturnLevelWithId('1');
    api.thenShouldReturnLevelWithId('2');
  });
});
