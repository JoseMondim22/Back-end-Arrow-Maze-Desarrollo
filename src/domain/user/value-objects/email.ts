import { InvalidEmailFormatError } from '../errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    if (!EMAIL_PATTERN.test(value)) {
      throw new InvalidEmailFormatError(`"${value}" is not a valid email address.`);
    }
    return new Email(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
