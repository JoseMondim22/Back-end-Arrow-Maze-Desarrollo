import { IQueryService } from '../ports/query-service';
import { GetPlayerProgressQuery } from '../queries/get-player-progress.query';
import { IProgressRepository } from '../../domain/progress/i-progress-repository';
import { Progress } from '../../domain/progress/progress.aggregate';
import { UserId } from '../../domain/user/value-objects/user-id';

export class GetPlayerProgressUseCase implements IQueryService<GetPlayerProgressQuery, Progress[]> {
  constructor(private readonly progressRepository: IProgressRepository) {}

  async execute(query: GetPlayerProgressQuery): Promise<Progress[]> {
    return this.progressRepository.findAllByUser(UserId.create(query.userId));
  }
}
