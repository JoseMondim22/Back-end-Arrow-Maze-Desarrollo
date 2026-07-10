import { IQueryService } from '../../../application/ports/query-service';
import { ILogger } from '../../../application/ports/logger';
import { ITimeProvider } from '../../../application/ports/time-provider';
import { runWithLogging } from '../shared/logging.helper';

export class LoggingQueryDecorator<TQuery, TResult> implements IQueryService<TQuery, TResult> {
  constructor(
    private readonly decoratee: IQueryService<TQuery, TResult>,
    private readonly logger: ILogger,
    private readonly timeProvider: ITimeProvider,
  ) {}

  async execute(query: TQuery): Promise<TResult> {
    return runWithLogging(
      this.logger,
      this.timeProvider,
      this.decoratee.constructor.name,
      () => this.decoratee.execute(query),
    );
  }
}
