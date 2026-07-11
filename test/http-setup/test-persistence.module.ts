import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../src/interface-adapters/entities/user.entity';
import { LevelEntity } from '../../src/interface-adapters/entities/level.entity';
import { ProgressEntity } from '../../src/interface-adapters/entities/progress.entity';
import { TypeOrmUserRepository } from '../../src/interface-adapters/repositories/typeorm-user.repository';
import { TypeOrmLevelRepository } from '../../src/interface-adapters/repositories/typeorm-level.repository';
import { TypeOrmProgressRepository } from '../../src/interface-adapters/repositories/typeorm-progress.repository';
import { LEVEL_REPOSITORY, PROGRESS_REPOSITORY, USER_REPOSITORY } from '../../src/infrastructure/tokens';

// Mirrors PersistenceModule (src/infrastructure/modules/persistence.module.ts) but
// points TypeORM at an in-memory sql.js database instead of the real Postgres
// DataSource, so integration tests never touch the developer's real local DB.
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: false,
      synchronize: true,
      entities: [UserEntity, LevelEntity, ProgressEntity],
    }),
    TypeOrmModule.forFeature([UserEntity, LevelEntity, ProgressEntity]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (repository: Repository<UserEntity>) => new TypeOrmUserRepository(repository),
      inject: [getRepositoryToken(UserEntity)],
    },
    {
      provide: LEVEL_REPOSITORY,
      useFactory: (repository: Repository<LevelEntity>) => new TypeOrmLevelRepository(repository),
      inject: [getRepositoryToken(LevelEntity)],
    },
    {
      provide: PROGRESS_REPOSITORY,
      useFactory: (repository: Repository<ProgressEntity>) =>
        new TypeOrmProgressRepository(repository),
      inject: [getRepositoryToken(ProgressEntity)],
    },
  ],
  exports: [USER_REPOSITORY, LEVEL_REPOSITORY, PROGRESS_REPOSITORY],
})
export class TestPersistenceModule {}
