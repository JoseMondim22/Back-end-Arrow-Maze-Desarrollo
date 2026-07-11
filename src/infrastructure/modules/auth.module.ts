import { Module } from '@nestjs/common';
import { IUserRepository } from '../../domain/user/i-user-repository';
import { IIdGenerator } from '../../application/ports/id-generator';
import { IPasswordHasher } from '../../application/ports/password-hasher';
import { ITokenGenerator } from '../../application/ports/token-generator';
import { ILogger } from '../../application/ports/logger';
import { ITimeProvider } from '../../application/ports/time-provider';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoggingCommandDecorator } from '../../interface-adapters/decorators/command/logging-command.decorator';
import { LoggingQueryDecorator } from '../../interface-adapters/decorators/query/logging-query.decorator';
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { LOGIN_SERVICE, REGISTER_USER_SERVICE } from '../../interface-adapters/controllers/tokens';
import { ID_GENERATOR, LOGGER, PASSWORD_HASHER, TIME_PROVIDER, TOKEN_GENERATOR, USER_REPOSITORY } from '../tokens';
import { PersistenceModule } from './persistence.module';
import { SharedServicesModule } from './shared-services.module';

@Module({
  imports: [PersistenceModule, SharedServicesModule],
  controllers: [AuthController],
  providers: [
    {
      provide: REGISTER_USER_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        idGenerator: IIdGenerator,
        passwordHasher: IPasswordHasher,
        logger: ILogger,
        timeProvider: ITimeProvider,
      ) =>
        new LoggingCommandDecorator(
          new RegisterUserUseCase(userRepository, idGenerator, passwordHasher),
          logger,
          timeProvider,
        ),
      inject: [USER_REPOSITORY, ID_GENERATOR, PASSWORD_HASHER, LOGGER, TIME_PROVIDER],
    },
    {
      provide: LOGIN_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        passwordHasher: IPasswordHasher,
        tokenGenerator: ITokenGenerator,
        logger: ILogger,
        timeProvider: ITimeProvider,
      ) =>
        new LoggingQueryDecorator(
          new LoginUseCase(userRepository, passwordHasher, tokenGenerator),
          logger,
          timeProvider,
        ),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR, LOGGER, TIME_PROVIDER],
    },
  ],
})
export class AuthModule {}
