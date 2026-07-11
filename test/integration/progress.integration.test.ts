import { ProgressIntegrationTestAPI } from './testing-api/progress-integration.test-api';

describe('POST /progress/sync', () => {
  const api = new ProgressIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_sync_progress_when_score_is_within_max_possible_score', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);

    await api.whenSyncingProgress(80);

    api.thenResponseStatusShouldBe(204);
  });

  it('should_reject_sync_when_score_exceeds_max_possible_score', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);

    await api.whenSyncingProgress(150);

    api.thenResponseStatusShouldBe(400);
  });

  it('should_reject_sync_when_no_token_provided', async () => {
    await api.givenAuthenticatedUser();
    await api.givenExistingLevelWithMaxScore(100);

    await api.whenSyncingProgressWithoutAuth(80);

    api.thenResponseStatusShouldBe(401);
  });
});
