export interface ITokenPayload {
  userId: string;
}

export interface ITokenGenerator {
  generate(userId: string): string;
  verify(token: string): ITokenPayload | null;
}
