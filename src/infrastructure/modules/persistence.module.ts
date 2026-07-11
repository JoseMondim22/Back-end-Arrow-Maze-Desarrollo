import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dataSourceOptions } from '../config/data-source';
import { UserEntity } from '../../interface-adapters/entities/user.entity';
import { LevelEntity } from '../../interface-adapters/entities/level.entity';
import { ProgressEntity } from '../../interface-adapters/entities/progress.entity';
import { TypeOrmUserRepository } from '../../interface-adapters/repositories/typeorm-user.repository';
import { TypeOrmLevelRepository } from '../../interface-adapters/repositories/typeorm-level.repository';
import { TypeOrmProgressRepository } from '../../interface-adapters/repositories/typeorm-progress.repository';
import { LEVEL_REPOSITORY, PROGRESS_REPOSITORY, USER_REPOSITORY } from '../tokens';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
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
export class PersistenceModule {}
