import { IQueryService } from '../../../application/ports/query-service';
import { CurrentUserProvider } from '../shared/current-user.provider';

export class SecureQueryDecorator<TQuery, TResult> implements IQueryService<TQuery, TResult> {
  constructor(
    private readonly decoratee: IQueryService<TQuery, TResult>,
    private readonly currentUser: CurrentUserProvider,
  ) {}

  async execute(query: TQuery): Promise<TResult> {
    this.currentUser.ensureAuthenticated();
    return this.decoratee.execute(query);
  }
}
