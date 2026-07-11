import { LeaderboardIntegrationTestAPI } from '../http-testing-api/leaderboard-integration.test-api';

describe('GET /leaderboard/:levelId', () => {
  const api = new LeaderboardIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_return_empty_leaderboard_when_no_progress_exists_for_level', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);

    await api.whenGettingLeaderboard();

    api.thenResponseStatusShouldBe(200);
    api.thenLeaderboardShouldHaveLength(0);
  });

  it('should_return_synced_score_when_progress_exists_for_level', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);
    await api.givenSyncedProgress(80);

    await api.whenGettingLeaderboard();

    api.thenResponseStatusShouldBe(200);
    api.thenLeaderboardShouldHaveLength(1);
    api.thenEntryAtPositionShouldHaveScore(0, 80);
  });

  it('should_reject_leaderboard_when_no_token_provided', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);

    await api.whenGettingLeaderboardWithoutAuth();

    api.thenResponseStatusShouldBe(401);
  });
});
