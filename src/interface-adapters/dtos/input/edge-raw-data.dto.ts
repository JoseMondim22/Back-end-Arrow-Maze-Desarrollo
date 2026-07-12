import { ApiProperty } from '@nestjs/swagger';

export class EdgeRawData {
  @ApiProperty({ example: '1' })
  readonly from: string;

  @ApiProperty({ example: '2' })
  readonly to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}
