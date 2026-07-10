import { ICommandService } from '../../../application/ports/command-service';
import { ILogger } from '../../../application/ports/logger';
import { ITimeProvider } from '../../../application/ports/time-provider';
import { runWithLogging } from '../shared/logging.helper';

export class LoggingCommandDecorator<TCommand> implements ICommandService<TCommand> {
  constructor(
    private readonly decoratee: ICommandService<TCommand>,
    private readonly logger: ILogger,
    private readonly timeProvider: ITimeProvider,
  ) {}

  async execute(command: TCommand): Promise<void> {
    await runWithLogging(
      this.logger,
      this.timeProvider,
      this.decoratee.constructor.name,
      () => this.decoratee.execute(command),
    );
  }
}
