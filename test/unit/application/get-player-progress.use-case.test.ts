import { GetPlayerProgressTestAPI } from '../../testing-api/get-player-progress.test-api';

describe('GetPlayerProgressUseCase', () => {
  let api: GetPlayerProgressTestAPI;

  beforeEach(() => {
    api = new GetPlayerProgressTestAPI();
  });

  it('should_return_empty_list_when_user_has_no_progress', async () => {
    api.givenNoExistingProgress();

    await api.whenGettingPlayerProgress('111111111111');

    api.thenShouldReturnEntryCount(0);
  });

  it('should_return_all_progress_entries_when_user_has_multiple_levels_completed', async () => {
    api.givenProgressForUser('111111111111', '1', 80);
    api.givenProgressForUser('111111111111', '2', 950);

    await api.whenGettingPlayerProgress('111111111111');

    api.thenShouldReturnEntryCount(2);
    api.thenShouldContainLevelWithScore('1', 80);
    api.thenShouldContainLevelWithScore('2', 950);
  });

  it('should_only_return_progress_for_the_requesting_user_when_other_users_have_progress', async () => {
    api.givenProgressForUser('111111111111', '1', 80);
    api.givenProgressForUser('222222222222', '1', 100);

    await api.whenGettingPlayerProgress('111111111111');

    api.thenShouldReturnEntryCount(1);
    api.thenShouldContainLevelWithScore('1', 80);
  });
});
