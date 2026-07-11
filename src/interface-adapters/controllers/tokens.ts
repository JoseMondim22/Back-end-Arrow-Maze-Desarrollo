import { ICommandService } from '../../application/ports/command-service';
import { IQueryService } from '../../application/ports/query-service';
import { CurrentUserProvider } from '../decorators/shared/current-user.provider';

/**
 * Built by the future CompositionRoot for each protected use case. The Controller
 * calls it with the CurrentUserProvider of THIS request, so the
 * SecureCommandDecorator/SecureQueryDecorator chain never outlives one request.
 */
export type SecureCommandServiceFactory<TCommand> = (
  currentUser: CurrentUserProvider,
) => ICommandService<TCommand>;
export type SecureQueryServiceFactory<TQuery, TResult> = (
  currentUser: CurrentUserProvider,
) => IQueryService<TQuery, TResult>;

/** Wraps this request's raw Bearer token into a CurrentUserProvider (memoized verify()). */
export type CurrentUserProviderFactory = (token: string) => CurrentUserProvider;

export const REGISTER_USER_SERVICE = Symbol('REGISTER_USER_SERVICE');
export const LOGIN_SERVICE = Symbol('LOGIN_SERVICE');
export const GET_LEVELS_SERVICE_FACTORY = Symbol('GET_LEVELS_SERVICE_FACTORY');
export const CREATE_LEVEL_SERVICE_FACTORY = Symbol('CREATE_LEVEL_SERVICE_FACTORY');
export const SYNC_PROGRESS_SERVICE_FACTORY = Symbol('SYNC_PROGRESS_SERVICE_FACTORY');
export const GET_LEADERBOARD_SERVICE_FACTORY = Symbol('GET_LEADERBOARD_SERVICE_FACTORY');
export const CURRENT_USER_PROVIDER_FACTORY = Symbol('CURRENT_USER_PROVIDER_FACTORY');
