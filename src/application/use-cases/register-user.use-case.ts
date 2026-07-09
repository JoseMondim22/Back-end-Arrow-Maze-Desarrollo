import { IUseCase } from '../ports/use-case';
import { IIdGenerator } from '../ports/id-generator';
import { IPasswordHasher } from '../ports/password-hasher';
import { RegisterUserCommand } from '../commands/register-user.command';
import { IUserRepository } from '../../domain/user/i-user-repository';
import { User } from '../../domain/user/user.aggregate';
import { UserId } from '../../domain/user/value-objects/user-id';
import { Email } from '../../domain/user/value-objects/email';
import { Password } from '../../domain/user/value-objects/password';
import { Username } from '../../domain/user/value-objects/username';
import { EmailAlreadyRegisteredError } from '../../domain/user/errors';

export class RegisterUserUseCase implements IUseCase<RegisterUserCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const email = Email.create(command.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyRegisteredError(
        `A user with email "${command.email}" is already registered.`,
      );
    }

    Password.ensureIsStrong(command.password);
    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = User.register(
      UserId.create(this.idGenerator.generate()),
      email,
      Password.fromHash(passwordHash),
      Username.create(command.username),
    );

    await this.userRepository.save(user);
  }
}
