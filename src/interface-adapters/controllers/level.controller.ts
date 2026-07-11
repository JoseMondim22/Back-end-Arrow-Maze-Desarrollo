import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Inject, Post, UseFilters } from '@nestjs/common';
import { Level } from '../../domain/level/level.aggregate';
import { GetLevelsQuery } from '../../application/queries/get-levels.query';
import { CreateLevelCommand } from '../../application/commands/create-level.command';
import { CreateLevelDTO } from '../dtos/input/create-level.dto';
import { LevelDTO } from '../dtos/output/level.dto';
import { BoardDTO } from '../dtos/output/board.dto';
import { BoardMapper } from '../mappers/board.mapper';
import { extractBearerToken } from './bearer-token.helper';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  CREATE_LEVEL_SERVICE_FACTORY,
  CURRENT_USER_PROVIDER_FACTORY,
  CurrentUserProviderFactory,
  GET_LEVELS_SERVICE_FACTORY,
  SecureCommandServiceFactory,
  SecureQueryServiceFactory,
} from './tokens';

@Controller('levels')
@UseFilters(DomainExceptionFilter)
export class LevelController {
  constructor(
    @Inject(CURRENT_USER_PROVIDER_FACTORY)
    private readonly currentUserProviderFactory: CurrentUserProviderFactory,
    @Inject(GET_LEVELS_SERVICE_FACTORY)
    private readonly getLevelsServiceFactory: SecureQueryServiceFactory<GetLevelsQuery, Level[]>,
    @Inject(CREATE_LEVEL_SERVICE_FACTORY)
    private readonly createLevelServiceFactory: SecureCommandServiceFactory<CreateLevelCommand>,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getLevels(@Headers('authorization') authorizationHeader?: string): Promise<LevelDTO[]> {
    const currentUser = this.currentUserProviderFactory(extractBearerToken(authorizationHeader));
    const levels = await this.getLevelsServiceFactory(currentUser).execute(new GetLevelsQuery());
    return levels.map((level) => this.toLevelDTO(level));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLevel(
    @Body() dto: CreateLevelDTO,
    @Headers('authorization') authorizationHeader?: string,
  ): Promise<void> {
    const currentUser = this.currentUserProviderFactory(extractBearerToken(authorizationHeader));
    await this.createLevelServiceFactory(currentUser).execute(
      new CreateLevelCommand(
        dto.nodes,
        dto.edges,
        dto.timeLimit,
        dto.maxMoves,
        dto.maxPossibleScore,
        dto.difficulty,
        dto.order,
      ),
    );
  }

  private toLevelDTO(level: Level): LevelDTO {
    const { nodes, edges } = BoardMapper.toRaw(level.getBoard());
    const rules = level.getRules();

    return new LevelDTO(
      level.getId().getValue(),
      new BoardDTO(nodes, edges),
      rules.getTimeLimit(),
      rules.getMaxMoves(),
      rules.getDifficulty(),
      level.getOrder().getValue(),
    );
  }
}
