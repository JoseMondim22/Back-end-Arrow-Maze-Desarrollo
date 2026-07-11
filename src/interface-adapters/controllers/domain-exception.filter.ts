import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DomainError } from '../../domain/shared/domain-error';
import { UnauthorizedError } from '../decorators/shared/errors';
import { EmailAlreadyRegisteredError, InvalidCredentialsError, UserNotFoundError } from '../../domain/user/errors';
import { LevelNotFoundError } from '../../domain/level/errors';

@Catch(DomainError, UnauthorizedError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError | UnauthorizedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const httpException = this.toHttpException(error);
    response.status(httpException.getStatus()).json(httpException.getResponse());
  }

  private toHttpException(error: DomainError | UnauthorizedError): HttpException {
    if (error instanceof UnauthorizedError || error instanceof InvalidCredentialsError) {
      return new UnauthorizedException(error.message);
    }
    if (error instanceof EmailAlreadyRegisteredError) {
      return new ConflictException(error.message);
    }
    if (error instanceof UserNotFoundError || error instanceof LevelNotFoundError) {
      return new NotFoundException(error.message);
    }
    return new BadRequestException(error.message);
  }
}
