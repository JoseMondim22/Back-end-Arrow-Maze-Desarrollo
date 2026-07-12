import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICommandService } from '../../application/ports/command-service';
import { IQueryService } from '../../application/ports/query-service';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { LoginQuery } from '../../application/queries/login.query';
import { LoginResult } from '../../application/results/login.result';
import { RegisterDTO } from '../dtos/input/register.dto';
import { LoginDTO } from '../dtos/input/login.dto';
import { TokenDTO } from '../dtos/output/token.dto';
import { DomainExceptionFilter } from './domain-exception.filter';
import { LOGIN_SERVICE, REGISTER_USER_SERVICE } from './tokens';

@ApiTags('auth')
@Controller('auth')
@UseFilters(DomainExceptionFilter)
export class AuthController {
  constructor(
    @Inject(REGISTER_USER_SERVICE)
    private readonly registerUserService: ICommandService<RegisterUserCommand>,
    @Inject(LOGIN_SERVICE)
    private readonly loginService: IQueryService<LoginQuery, LoginResult>,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDTO): Promise<void> {
    await this.registerUserService.execute(
      new RegisterUserCommand(dto.email, dto.password, dto.username),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate a user and issue an access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: TokenDTO })
  async login(@Body() dto: LoginDTO): Promise<TokenDTO> {
    const result = await this.loginService.execute(new LoginQuery(dto.email, dto.password));
    return new TokenDTO(result.accessToken, result.userId);
  }
}
