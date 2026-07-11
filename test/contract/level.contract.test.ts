import { LevelIntegrationTestAPI } from '../http-testing-api/level-integration.test-api';
import { CreateLevelDTO } from '../../src/interface-adapters/dtos/input/create-level.dto';
import { NodeRawData } from '../../src/interface-adapters/dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../../src/interface-adapters/dtos/input/edge-raw-data.dto';

const validLevelPayload = new CreateLevelDTO(
  [new NodeRawData('1', 'grid_arrow', 0, 0, 'up'), new NodeRawData('2', 'exit', 0, 1)],
  [new EdgeRawData('1', '2')],
  60,
  20,
  100,
  1,
  1,
);

describe('GET /levels response shape', () => {
  const api = new LevelIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_match_LevelDTO_shape_when_a_level_exists', async () => {
    await api.givenAuthenticatedUser();
    await api.whenCreatingLevel(validLevelPayload);

    await api.whenGettingLevels();

    api.thenResponseShouldMatchLevelDTOShape();
  });
});
