import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  readonly accessToken: string;

  @ApiProperty({ example: 'user-1' })
  readonly userId: string;

  constructor(accessToken: string, userId: string) {
    this.accessToken = accessToken;
    this.userId = userId;
  }
}
