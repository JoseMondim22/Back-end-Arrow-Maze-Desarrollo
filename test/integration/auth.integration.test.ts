import { AuthIntegrationTestAPI } from './testing-api/auth-integration.test-api';
import { RegisterDTO } from '../../src/interface-adapters/dtos/input/register.dto';
import { LoginDTO } from '../../src/interface-adapters/dtos/input/login.dto';

describe('POST /auth/register + POST /auth/login', () => {
  const api = new AuthIntegrationTestAPI();

  beforeAll(() => api.setup());
  afterAll(() => api.teardown());

  it('should_register_user_when_payload_is_valid', async () => {
    await api.whenRegistering(new RegisterDTO('alice@example.com', 'Password1', 'alice'));

    api.thenResponseStatusShouldBe(201);
  });

  it('should_return_access_token_and_user_id_when_login_with_valid_credentials', async () => {
    await api.whenRegistering(new RegisterDTO('bob@example.com', 'Password1', 'bob'));

    await api.whenLoggingIn(new LoginDTO('bob@example.com', 'Password1'));

    api.thenResponseStatusShouldBe(200);
    api.thenResponseShouldHaveAccessToken();
    api.thenResponseShouldHaveUserId();
  });

  it('should_reject_registration_when_email_is_already_registered', async () => {
    await api.whenRegistering(new RegisterDTO('carol@example.com', 'Password1', 'carol'));

    await api.whenRegistering(new RegisterDTO('carol@example.com', 'Password1', 'carol2'));

    api.thenResponseStatusShouldBe(409);
    api.thenResponseMessageShouldContain('already registered');
  });

  it('should_reject_login_when_credentials_are_invalid', async () => {
    await api.whenRegistering(new RegisterDTO('dave@example.com', 'Password1', 'dave'));

    await api.whenLoggingIn(new LoginDTO('dave@example.com', 'WrongPassword1'));

    api.thenResponseStatusShouldBe(401);
  });
});
