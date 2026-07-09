import { PasswordTooWeakError } from '../errors';

const MIN_LENGTH = 8;
const HAS_LETTER = /[A-Za-z]/;
const HAS_DIGIT = /\d/;

export class Password {
  private readonly hash: string;

  private constructor(hash: string) {
    this.hash = hash;
  }

  static ensureIsStrong(plainText: string): void {
    if (
      plainText.length < MIN_LENGTH ||
      !HAS_LETTER.test(plainText) ||
      !HAS_DIGIT.test(plainText)
    ) {
      throw new PasswordTooWeakError(
        `Password must be at least ${MIN_LENGTH} characters long and contain at least one letter and one number.`,
      );
    }
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  getHash(): string {
    return this.hash;
  }
}
