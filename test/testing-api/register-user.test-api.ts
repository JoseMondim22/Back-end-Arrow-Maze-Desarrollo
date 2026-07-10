import { RegisterUserUseCase } from '../../src/application/use-cases/register-user.use-case';
import { RegisterUserCommand } from '../../src/application/commands/register-user.command';
import { IIdGenerator } from '../../src/application/ports/id-generator';
import { IPasswordHasher } from '../../src/application/ports/password-hasher';
import { InMemoryUserRepository } from '../in-memory/in-memory-user.repository';
import { UserMother } from '../mothers/user.mother';

const GENERATED_ID = '222222222222';
const HASHED_PASSWORD = 'hashed-password';

export class RegisterUserTestAPI {
  private readonly userRepository = new InMemoryUserRepository();
  private readonly idGenerator: IIdGenerator = {
    generate: jest.fn().mockReturnValue(GENERATED_ID),
  };
  private readonly passwordHasher: IPasswordHasher = {
    hash: jest.fn().mockResolvedValue(HASHED_PASSWORD),
  };
  private thrownError: Error | null = null;

  givenExistingUserWithEmail(email: string): void {
    this.userRepository.seed(UserMother.withEmail(email));
  }

  async whenRegisteringUser(command: RegisterUserCommand): Promise<void> {
    const useCase = new RegisterUserUseCase(
      this.userRepository,
      this.idGenerator,
      this.passwordHasher,
    );

    try {
      await useCase.execute(command);
    } catch (error) {
      this.thrownError = error as Error;
    }
  }

  thenUserShouldBeSavedWithEmailAndUsername(email: string, username: string): void {
    const savedUser = this.userRepository
      .getSavedUsers()
      .find((user) => user.getEmail().getValue() === email);

    expect(savedUser).toBeDefined();
    expect(savedUser!.getUsername().getValue()).toBe(username);
  }

  thenSavedUserShouldHaveGeneratedId(): void {
    const savedUser = this.userRepository.getSavedUsers()[0];
    expect(savedUser.getId().getValue()).toBe(GENERATED_ID);
  }

  thenSavedUserShouldHaveHashedPassword(): void {
    const savedUser = this.userRepository.getSavedUsers()[0];
    expect(this.passwordHasher.hash).toHaveBeenCalled();
    expect(savedUser.getPassword().getHash()).toBe(HASHED_PASSWORD);
  }

  thenNoUserShouldBeSaved(): void {
    expect(this.userRepository.getSavedUsers()).toHaveLength(0);
  }

  thenShouldFailWith(errorClass: new (...args: never[]) => Error): void {
    expect(this.thrownError).toBeInstanceOf(errorClass);
  }

  thenShouldFailWithMessage(message: string): void {
    expect(this.thrownError?.message).toBe(message);
  }
}
