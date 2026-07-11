import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/user/i-user-repository';
import { User } from '../../domain/user/user.aggregate';
import { UserId } from '../../domain/user/value-objects/user-id';
import { Email } from '../../domain/user/value-objects/email';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly ormRepository: Repository<UserEntity>) {}

  async findById(id: UserId): Promise<User | null> {
    const entity = await this.ormRepository.findOneBy({ id: id.getValue() });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.ormRepository.findOneBy({ email: email.getValue() });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.ormRepository.save(entity);
  }
}
