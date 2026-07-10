import { LoginUseCase } from '../../src/application/use-cases/login.use-case';
import { LoginQuery } from '../../src/application/queries/login.query';
import { LoginResult } from '../../src/application/results/login.result';
import { IPasswordHasher } from '../../src/application/ports/password-hasher';
import { ITokenGenerator } from '../../src/application/ports/token-generator';
import { InMemoryUserRepository } from '../in-memory/in-memory-user.repository';
import { UserMother } from '../mothers/user.mother';

const GENERATED_TOKEN = 'generated-jwt-token';

export class LoginTestAPI {
  private readonly userRepository = new InMemoryUserRepository();
  private readonly passwordHasher: IPasswordHasher = {
    hash: jest.fn(),
    verify: jest.fn().mockResolvedValue(true),
  };
  private readonly tokenGenerator: ITokenGenerator = {
    generate: jest.fn().mockReturnValue(GENERATED_TOKEN),
    verify: jest.fn(),
  };
  private result: LoginResult | null = null;
  private thrownError: Error | null = null;

  givenExistingUserWithEmail(email: string): void {
    this.userRepository.seed(UserMother.withEmail(email));
  }

  givenIncorrectPassword(): void {
    (this.passwordHasher.verify as jest.Mock).mockResolvedValue(false);
  }

  async whenLoggingIn(query: LoginQuery): Promise<void> {
    const useCase = new LoginUseCase(this.userRepository, this.passwordHasher, this.tokenGenerator);

    try {
      this.result = await useCase.execute(query);
    } catch (error) {
      this.thrownError = error as Error;
    }
  }

  thenShouldReturnAccessToken(): void {
    expect(this.result?.accessToken).toBe(GENERATED_TOKEN);
  }

  thenShouldReturnUserId(expectedUserId: string): void {
    expect(this.result?.userId).toBe(expectedUserId);
  }

  thenTokenShouldBeGeneratedForUserId(expectedUserId: string): void {
    expect(this.tokenGenerator.generate).toHaveBeenCalledWith(expectedUserId);
  }

  thenShouldFailWith(errorClass: new (...args: never[]) => Error): void {
    expect(this.thrownError).toBeInstanceOf(errorClass);
  }

  thenNoResultShouldBeReturned(): void {
    expect(this.result).toBeNull();
  }
}
