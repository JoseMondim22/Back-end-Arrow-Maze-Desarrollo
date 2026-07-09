import { IUserRepository } from '../../src/domain/user/i-user-repository';
import { User } from '../../src/domain/user/user.aggregate';
import { UserId } from '../../src/domain/user/value-objects/user-id';
import { Email } from '../../src/domain/user/value-objects/email';

export class InMemoryUserRepository implements IUserRepository {
  private readonly seededUsers: User[] = [];
  private readonly savedUsers: User[] = [];

  async findById(id: UserId): Promise<User | null> {
    return this.allUsers().find((user) => user.getId().equals(id)) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.allUsers().find((user) => user.getEmail().equals(email)) ?? null;
  }

  async save(user: User): Promise<void> {
    this.savedUsers.push(user);
  }

  seed(user: User): void {
    this.seededUsers.push(user);
  }

  getSavedUsers(): User[] {
    return this.savedUsers;
  }

  private allUsers(): User[] {
    return [...this.seededUsers, ...this.savedUsers];
  }
}
