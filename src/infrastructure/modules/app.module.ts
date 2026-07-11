import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence.module';
import { SharedServicesModule } from './shared-services.module';
import { SecurityModule } from './security.module';
import { AuthModule } from './auth.module';
import { LevelModule } from './level.module';
import { ProgressModule } from './progress.module';
import { LeaderboardModule } from './leaderboard.module';

@Module({
  imports: [
    PersistenceModule,
    SharedServicesModule,
    SecurityModule,
    AuthModule,
    LevelModule,
    ProgressModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
