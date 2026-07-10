import { IQueryService } from '../ports/query-service';
import { IPasswordHasher } from '../ports/password-hasher';
import { ITokenGenerator } from '../ports/token-generator';
import { LoginQuery } from '../queries/login.query';
import { LoginResult } from '../results/login.result';
import { IUserRepository } from '../../domain/user/i-user-repository';
import { Email } from '../../domain/user/value-objects/email';
import { InvalidCredentialsError } from '../../domain/user/errors';

export class LoginUseCase implements IQueryService<LoginQuery, LoginResult> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(query: LoginQuery): Promise<LoginResult> {
    const email = Email.create(query.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError('Invalid email or password.');
    }

    const isPasswordValid = await this.passwordHasher.verify(
      query.password,
      user.getPassword().getHash(),
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Invalid email or password.');
    }

    const accessToken = this.tokenGenerator.generate(user.getId().getValue());

    return new LoginResult(accessToken, user.getId().getValue());
  }
}
