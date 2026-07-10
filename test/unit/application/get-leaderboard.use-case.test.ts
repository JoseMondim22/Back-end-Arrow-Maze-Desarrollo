import { UserNotFoundError } from '../../../src/domain/user/errors';
import { GetLeaderboardTestAPI } from '../../testing-api/get-leaderboard.test-api';

describe('GetLeaderboardUseCase', () => {
  it('should_return_empty_list_when_no_progress_exists', async () => {
    // Arrange
    const api = new GetLeaderboardTestAPI();
    api.givenNoExistingProgress();

    // Act
    await api.whenGettingLeaderboard(10);

    // Assert
    api.thenShouldReturnEntryCount(0);
  });

  it('should_rank_entries_by_score_descending_when_multiple_progresses_exist', async () => {
    // Arrange
    const api = new GetLeaderboardTestAPI();
    api.givenUserWithProgress('111111111111', 'alice', 500);
    api.givenUserWithProgress('222222222222', 'bob', 900);
    api.givenUserWithProgress('333333333333', 'carol', 700);

    // Act
    await api.whenGettingLeaderboard(10);

    // Assert
    api.thenEntryAtPositionShouldHave(1, 'bob', 900);
    api.thenEntryAtPositionShouldHave(2, 'carol', 700);
    api.thenEntryAtPositionShouldHave(3, 'alice', 500);
  });

  it('should_limit_results_when_more_progresses_exist_than_limit', async () => {
    // Arrange
    const api = new GetLeaderboardTestAPI();
    api.givenUserWithProgress('111111111111', 'alice', 500);
    api.givenUserWithProgress('222222222222', 'bob', 900);
    api.givenUserWithProgress('333333333333', 'carol', 700);

    // Act
    await api.whenGettingLeaderboard(2);

    // Assert
    api.thenShouldReturnEntryCount(2);
  });

  it('should_fail_when_progress_references_a_user_that_does_not_exist', async () => {
    // Arrange
    const api = new GetLeaderboardTestAPI();
    api.givenProgressWithoutMatchingUser('999999999999', 500);

    // Act
    await api.whenGettingLeaderboard(10);

    // Assert
    api.thenShouldFailWith(UserNotFoundError);
  });
});
