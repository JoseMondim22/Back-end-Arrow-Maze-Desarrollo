export interface IPasswordHasher {
  hash(plainText: string): Promise<string>;
}
