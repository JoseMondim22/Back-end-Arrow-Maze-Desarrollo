import { Repository } from 'typeorm';
import { IProgressRepository } from '../../domain/progress/i-progress-repository';
import { Progress } from '../../domain/progress/progress.aggregate';
import { UserId } from '../../domain/user/value-objects/user-id';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { ProgressEntity } from '../entities/progress.entity';
import { ProgressMapper } from '../mappers/progress.mapper';

export class TypeOrmProgressRepository implements IProgressRepository {
  constructor(private readonly ormRepository: Repository<ProgressEntity>) {}

  async findByUserAndLevel(userId: UserId, levelId: LevelId): Promise<Progress | null> {
    const entity = await this.ormRepository.findOneBy({
      userId: userId.getValue(),
      levelId: levelId.getValue(),
    });
    return entity ? ProgressMapper.toDomain(entity) : null;
  }

  async findTopScoresByLevel(levelId: LevelId, limit: number): Promise<Progress[]> {
    const entities = await this.ormRepository.find({
      where: { levelId: levelId.getValue() },
      order: { bestScore: 'DESC' },
      take: limit,
    });
    return entities.map((entity) => ProgressMapper.toDomain(entity));
  }

  async save(progress: Progress): Promise<void> {
    const entity = ProgressMapper.toEntity(progress);
    await this.ormRepository.save(entity);
  }
}
