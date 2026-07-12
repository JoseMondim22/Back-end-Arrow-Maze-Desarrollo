import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({ example: 'player@arrowmaze.com' })
  readonly email: string;

  @ApiProperty({ example: 'S3cur3P4ss!' })
  readonly password: string;

  @ApiProperty({ example: 'player1' })
  readonly username: string;

  constructor(email: string, password: string, username: string) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}
