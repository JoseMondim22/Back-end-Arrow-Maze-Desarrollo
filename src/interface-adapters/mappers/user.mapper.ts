import { User } from '../../domain/user/user.aggregate';
import { UserId } from '../../domain/user/value-objects/user-id';
import { Email } from '../../domain/user/value-objects/email';
import { Password } from '../../domain/user/value-objects/password';
import { Username } from '../../domain/user/value-objects/username';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return User.reconstitute(
      UserId.create(entity.id),
      Email.create(entity.email),
      Password.fromHash(entity.passwordHash),
      Username.create(entity.username),
    );
  }

  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId().getValue();
    entity.email = user.getEmail().getValue();
    entity.passwordHash = user.getPassword().getHash();
    entity.username = user.getUsername().getValue();
    return entity;
  }
}
