import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BcryptPasswordHasher } from '../auth/bcrypt-password-hasher';
import { JwtTokenGenerator } from '../auth/jwt-token-generator';
import { NumericIdGenerator } from '../shared/numeric-id.generator';
import { ConsoleLogger } from '../shared/console.logger';
import { SystemTimeProvider } from '../shared/system-time.provider';
import { ID_GENERATOR, LOGGER, PASSWORD_HASHER, TIME_PROVIDER, TOKEN_GENERATOR } from '../tokens';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: ID_GENERATOR, useClass: NumericIdGenerator },
    { provide: LOGGER, useClass: ConsoleLogger },
    { provide: TIME_PROVIDER, useClass: SystemTimeProvider },
    {
      provide: TOKEN_GENERATOR,
      useFactory: (jwtService: JwtService) => new JwtTokenGenerator(jwtService),
      inject: [JwtService],
    },
  ],
  exports: [PASSWORD_HASHER, ID_GENERATOR, LOGGER, TIME_PROVIDER, TOKEN_GENERATOR],
})
export class SharedServicesModule {}
