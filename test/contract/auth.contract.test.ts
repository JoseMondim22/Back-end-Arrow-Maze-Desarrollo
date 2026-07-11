import { AuthIntegrationTestAPI } from '../http-testing-api/auth-integration.test-api';
import { RegisterDTO } from '../../src/interface-adapters/dtos/input/register.dto';
import { LoginDTO } from '../../src/interface-adapters/dtos/input/login.dto';

describe('POST /auth/login response shape', () => {
  const api = new AuthIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_match_TokenDTO_shape_when_login_succeeds', async () => {
    await api.whenRegistering(new RegisterDTO('shape-tester@example.com', 'Password1', 'shapeTester'));

    await api.whenLoggingIn(new LoginDTO('shape-tester@example.com', 'Password1'));

    api.thenResponseShouldMatchTokenDTOShape();
  });
});
