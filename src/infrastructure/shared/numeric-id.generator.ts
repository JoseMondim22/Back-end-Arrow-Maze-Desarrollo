import { randomInt } from 'crypto';
import { Injectable } from '@nestjs/common';
import { IIdGenerator } from '../../application/ports/id-generator';

// UserId/LevelId/ProgressId/NodeId all require a numeric string of at most 12 digits.
const MAX_DIGITS = 12;
const MIN_VALUE = 10 ** (MAX_DIGITS - 1);
const MAX_VALUE = 10 ** MAX_DIGITS - 1;

@Injectable()
export class NumericIdGenerator implements IIdGenerator {
  generate(): string {
    return randomInt(MIN_VALUE, MAX_VALUE).toString();
  }
}
