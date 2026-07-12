import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'player@arrowmaze.com' })
  readonly email: string;

  @ApiProperty({ example: 'S3cur3P4ss!' })
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
