import { Injectable } from '@nestjs/common';
import { ILogger } from '../../application/ports/logger';

@Injectable()
export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}
