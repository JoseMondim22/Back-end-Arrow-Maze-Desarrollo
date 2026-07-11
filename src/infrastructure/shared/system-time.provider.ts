import { Injectable } from '@nestjs/common';
import { ITimeProvider } from '../../application/ports/time-provider';

@Injectable()
export class SystemTimeProvider implements ITimeProvider {
  now(): Date {
    return new Date();
  }
}
