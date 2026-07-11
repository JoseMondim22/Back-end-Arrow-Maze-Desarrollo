import { ITokenGenerator, ITokenPayload } from '../../../application/ports/token-generator';
import { UnauthorizedError } from './errors';

/**
 * One instance per HTTP request. Wraps the raw JWT and memoizes the result of
 * verifying it, so no matter who asks first — the Controller (to read a domain
 * claim like userId) or the SecureCommandDecorator/SecureQueryDecorator (to gate
 * execution) — the token is only decoded and verified once.
 */
export class CurrentUserProvider {
  private resolved = false;
  private payload: ITokenPayload | null = null;

  constructor(
    private readonly tokenGenerator: ITokenGenerator,
    private readonly token: string,
  ) {}

  ensureAuthenticated(): void {
    this.getPayload();
  }

  getUserId(): string {
    return this.getPayload().userId;
  }

  private getPayload(): ITokenPayload {
    if (!this.resolved) {
      this.payload = this.tokenGenerator.verify(this.token);
      this.resolved = true;
    }
    if (!this.payload) {
      throw new UnauthorizedError('Invalid or expired token.');
    }
    return this.payload;
  }
}
