import { ApiProperty } from '@nestjs/swagger';

export class ChainRawData {
  @ApiProperty({ example: 'c1' })
  readonly id: string;

  @ApiProperty({ example: ['3', '2', '1'], type: [String], description: 'Node ids ordered tail to head' })
  readonly nodeIds: string[];

  constructor(id: string, nodeIds: string[]) {
    this.id = id;
    this.nodeIds = nodeIds;
  }
}
