import { Module } from '@nestjs/common';
import { ITokenGenerator } from '../../application/ports/token-generator';
import { CurrentUserProvider } from '../../interface-adapters/decorators/shared/current-user.provider';
import { CURRENT_USER_PROVIDER_FACTORY, CurrentUserProviderFactory } from '../../interface-adapters/controllers/tokens';
import { TOKEN_GENERATOR } from '../tokens';
import { SharedServicesModule } from './shared-services.module';

@Module({
  imports: [SharedServicesModule],
  providers: [
    {
      provide: CURRENT_USER_PROVIDER_FACTORY,
      useFactory: (tokenGenerator: ITokenGenerator): CurrentUserProviderFactory =>
        (token: string) =>
          new CurrentUserProvider(tokenGenerator, token),
      inject: [TOKEN_GENERATOR],
    },
  ],
  exports: [CURRENT_USER_PROVIDER_FACTORY],
})
export class SecurityModule {}
