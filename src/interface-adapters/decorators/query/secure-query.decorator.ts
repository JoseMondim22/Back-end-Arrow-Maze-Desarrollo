import { IQueryService } from '../../../application/ports/query-service';
import { ITokenGenerator } from '../../../application/ports/token-generator';
import { verifyAuth } from '../shared/auth.helper';

export class SecureQueryDecorator<TQuery, TResult> implements IQueryService<TQuery, TResult> {
  constructor(
    private readonly decoratee: IQueryService<TQuery, TResult>,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly token: string,
  ) {}

  async execute(query: TQuery): Promise<TResult> {
    verifyAuth(this.tokenGenerator, this.token);
    return this.decoratee.execute(query);
  }
}
