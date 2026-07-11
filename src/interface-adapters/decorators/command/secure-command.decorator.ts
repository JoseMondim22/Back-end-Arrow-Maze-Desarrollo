import { ICommandService } from '../../../application/ports/command-service';
import { CurrentUserProvider } from '../shared/current-user.provider';

export class SecureCommandDecorator<TCommand> implements ICommandService<TCommand> {
  constructor(
    private readonly decoratee: ICommandService<TCommand>,
    private readonly currentUser: CurrentUserProvider,
  ) {}

  async execute(command: TCommand): Promise<void> {
    this.currentUser.ensureAuthenticated();
    return this.decoratee.execute(command);
  }
}
