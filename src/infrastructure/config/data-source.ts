import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../../interface-adapters/entities/user.entity';
import { LevelEntity } from '../../interface-adapters/entities/level.entity';
import { ProgressEntity } from '../../interface-adapters/entities/progress.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'arrow_maze',
  entities: [UserEntity, LevelEntity, ProgressEntity],
  synchronize: process.env.NODE_ENV !== 'production',
};
