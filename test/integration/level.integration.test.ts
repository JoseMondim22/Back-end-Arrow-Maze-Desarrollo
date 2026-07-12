import { LevelIntegrationTestAPI } from '../http-testing-api/level-integration.test-api';
import { CreateLevelDTO } from '../../src/interface-adapters/dtos/input/create-level.dto';
import { NodeRawData } from '../../src/interface-adapters/dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../../src/interface-adapters/dtos/input/edge-raw-data.dto';
import { ChainRawData } from '../../src/interface-adapters/dtos/input/chain-raw-data.dto';

const validLevelPayload = new CreateLevelDTO(
  [
    new NodeRawData('1', 'grid_arrow', 0, 0, 'up'),
    new NodeRawData('2', 'exit', 0, 1),
  ],
  [new EdgeRawData('1', '2')],
  [new ChainRawData('c1', ['1'])],
  60,
  20,
  100,
  1,
  1,
);

const payloadWithoutExitCell = new CreateLevelDTO(
  [new NodeRawData('1', 'grid_arrow', 0, 0, 'up')],
  [],
  [],
  60,
  20,
  100,
  1,
  1,
);

describe('GET /levels + POST /levels', () => {
  const api = new LevelIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_create_level_and_return_it_when_valid_payload_and_authenticated', async () => {
    await api.givenAuthenticatedUser();

    await api.whenCreatingLevel(validLevelPayload);
    api.thenResponseStatusShouldBe(201);

    await api.whenGettingLevels();
    api.thenLevelListShouldHaveLength(1);
    api.thenFirstLevelShouldHaveOrder(1);
  });

  it('should_reject_level_creation_when_board_has_no_exit_cell', async () => {
    await api.givenAuthenticatedUser();

    await api.whenCreatingLevel(payloadWithoutExitCell);

    api.thenResponseStatusShouldBe(400);
  });

  it('should_reject_level_creation_when_no_token_provided', async () => {
    await api.whenCreatingLevelWithoutAuth(validLevelPayload);

    api.thenResponseStatusShouldBe(401);
  });

  it('should_reject_getting_levels_when_no_token_provided', async () => {
    await api.whenGettingLevelsWithoutAuth();

    api.thenResponseStatusShouldBe(401);
  });
});
