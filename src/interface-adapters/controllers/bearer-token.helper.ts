import { UnauthorizedException } from '@nestjs/common';

const BEARER_PREFIX = 'Bearer ';

export function extractBearerToken(authorizationHeader: string | undefined): string {
  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedException('Missing or malformed Authorization header.');
  }
  return authorizationHeader.slice(BEARER_PREFIX.length);
}
