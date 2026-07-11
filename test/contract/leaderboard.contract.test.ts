import { LeaderboardIntegrationTestAPI } from '../http-testing-api/leaderboard-integration.test-api';

describe('GET /leaderboard/:levelId response shape', () => {
  const api = new LeaderboardIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_match_LeaderboardEntryDTO_shape_when_progress_exists', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);
    await api.givenSyncedProgress(80);

    await api.whenGettingLeaderboard();

    api.thenResponseShouldMatchLeaderboardEntryDTOShape();
  });
});
