import { Repository } from 'typeorm';
import { ILevelRepository } from '../../domain/level/i-level-repository';
import { Level } from '../../domain/level/level.aggregate';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { LevelEntity } from '../entities/level.entity';
import { LevelMapper } from '../mappers/level.mapper';

export class TypeOrmLevelRepository implements ILevelRepository {
  constructor(private readonly ormRepository: Repository<LevelEntity>) {}

  async findById(id: LevelId): Promise<Level | null> {
    const entity = await this.ormRepository.findOneBy({ id: id.getValue() });
    return entity ? LevelMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Level[]> {
    const entities = await this.ormRepository.find();
    return entities.map((entity) => LevelMapper.toDomain(entity));
  }

  async save(level: Level): Promise<void> {
    const entity = LevelMapper.toEntity(level);
    await this.ormRepository.save(entity);
  }
}
