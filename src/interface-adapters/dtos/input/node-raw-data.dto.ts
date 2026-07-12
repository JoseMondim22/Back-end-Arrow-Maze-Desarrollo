import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NodeRawData {
  @ApiProperty({ example: '1' })
  readonly id: string;

  @ApiProperty({ example: 'grid_arrow', enum: ['grid_arrow', 'wall', 'empty', 'exit'] })
  readonly type: string;

  @ApiProperty({ example: 0 })
  readonly row: number;

  @ApiProperty({ example: 0 })
  readonly column: number;

  @ApiPropertyOptional({ example: 'up', enum: ['up', 'right', 'down', 'left'] })
  readonly direction?: string;

  constructor(id: string, type: string, row: number, column: number, direction?: string) {
    this.id = id;
    this.type = type;
    this.row = row;
    this.column = column;
    this.direction = direction;
  }
}
