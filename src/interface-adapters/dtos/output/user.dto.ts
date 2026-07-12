import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ example: 'user-1' })
  readonly id: string;

  @ApiProperty({ example: 'player@arrowmaze.com' })
  readonly email: string;

  @ApiProperty({ example: 'player1' })
  readonly username: string;

  constructor(id: string, email: string, username: string) {
    this.id = id;
    this.email = email;
    this.username = username;
  }
}
