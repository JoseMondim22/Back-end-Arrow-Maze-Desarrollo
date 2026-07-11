import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator, ITokenPayload } from '../../application/ports/token-generator';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generate(userId: string): string {
    const payload: ITokenPayload = { userId };
    return this.jwtService.sign(payload);
  }

  verify(token: string): ITokenPayload | null {
    try {
      return this.jwtService.verify<ITokenPayload>(token);
    } catch {
      return null;
    }
  }
}
