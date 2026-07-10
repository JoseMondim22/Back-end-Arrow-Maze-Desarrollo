import { ICommandService } from '../../../application/ports/command-service';
import { ITokenGenerator } from '../../../application/ports/token-generator';
import { verifyAuth } from '../shared/auth.helper';

export class SecureCommandDecorator<TCommand> implements ICommandService<TCommand> {
  constructor(
    private readonly decoratee: ICommandService<TCommand>,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly token: string,
  ) {}

  async execute(command: TCommand): Promise<void> {
    verifyAuth(this.tokenGenerator, this.token);
    return this.decoratee.execute(command);
  }
}
