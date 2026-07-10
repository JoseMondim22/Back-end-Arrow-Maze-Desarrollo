import { SyncProgressCommand } from '../../../src/application/commands/sync-progress.command';
import { LevelNotFoundError } from '../../../src/domain/level/errors';
import { ImplausibleScoreError } from '../../../src/domain/progress/errors';
import { SyncProgressTestAPI } from '../../testing-api/sync-progress.test-api';

const USER_ID = '111111111111';
const LEVEL_ID = '1';

describe('SyncProgressUseCase', () => {
  it('should_save_new_progress_when_no_existing_progress', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenLevelWithMaxScore(1000);
    api.givenNoExistingProgress();
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 800);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenProgressShouldBeSavedWithBestScore(800);
  });

  it('should_assign_generated_id_when_creating_new_progress', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenLevelWithMaxScore(1000);
    api.givenNoExistingProgress();
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 800);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenSavedProgressShouldHaveGeneratedId();
  });

  it('should_update_best_score_when_new_score_is_higher_than_existing', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenLevelWithMaxScore(1000);
    api.givenExistingProgress(USER_ID, LEVEL_ID, 500);
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 800);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenProgressShouldBeSavedWithBestScore(800);
  });

  it('should_keep_best_score_when_new_score_is_lower_than_existing', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenLevelWithMaxScore(1000);
    api.givenExistingProgress(USER_ID, LEVEL_ID, 800);
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 500);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenProgressShouldBeSavedWithBestScore(800);
  });

  it('should_fail_when_level_does_not_exist', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenNoExistingLevel();
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 800);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenShouldFailWith(LevelNotFoundError);
  });

  it('should_not_save_progress_when_level_does_not_exist', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenNoExistingLevel();
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 800);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenNoProgressShouldBeSaved();
  });

  it('should_fail_when_score_exceeds_max_possible_score', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenLevelWithMaxScore(1000);
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 1500);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenShouldFailWith(ImplausibleScoreError);
  });

  it('should_not_save_progress_when_score_exceeds_max_possible_score', async () => {
    // Arrange
    const api = new SyncProgressTestAPI();
    api.givenLevelWithMaxScore(1000);
    const command = new SyncProgressCommand(USER_ID, LEVEL_ID, 1500);

    // Act
    await api.whenSyncingProgress(command);

    // Assert
    api.thenNoProgressShouldBeSaved();
  });
});
