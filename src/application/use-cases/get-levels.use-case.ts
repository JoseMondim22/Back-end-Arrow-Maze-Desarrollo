import { IQueryService } from '../ports/query-service';
import { GetLevelsQuery } from '../queries/get-levels.query';
import { ILevelRepository } from '../../domain/level/i-level-repository';
import { Level } from '../../domain/level/level.aggregate';

export class GetLevelsUseCase implements IQueryService<GetLevelsQuery, Level[]> {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async execute(_query: GetLevelsQuery): Promise<Level[]> {
    return this.levelRepository.findAll();
  }
}
