import { ITokenGenerator } from '../../../application/ports/token-generator';
import { UnauthorizedError } from './errors';

export function verifyAuth(tokenGenerator: ITokenGenerator, token: string): void {
  const payload = tokenGenerator.verify(token);
  if (!payload) {
    throw new UnauthorizedError('Invalid or expired token.');
  }
}
