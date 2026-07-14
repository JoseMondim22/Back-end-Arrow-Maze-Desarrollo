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

  @ApiPropertyOptional({ example: 'up', enum: ['up', 'right', 'down', 'left', 'forward', 'backward'] })
  readonly direction?: string;

  @ApiPropertyOptional({ example: 0, description: 'Depth axis coordinate. Required when positionType is "grid3d".' })
  readonly layer?: number;

  @ApiPropertyOptional({ example: 'grid', enum: ['grid', 'grid3d'], description: 'Board geometry this node belongs to. Defaults to "grid".' })
  readonly positionType?: string;

  constructor(
    id: string,
    type: string,
    row: number,
    column: number,
    direction?: string,
    layer?: number,
    positionType?: string,
  ) {
    this.id = id;
    this.type = type;
    this.row = row;
    this.column = column;
    this.direction = direction;
    this.layer = layer;
    this.positionType = positionType;
  }
}
