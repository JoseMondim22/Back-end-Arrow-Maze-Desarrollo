import { ApiProperty } from '@nestjs/swagger';
import { NodeRawData } from '../input/node-raw-data.dto';
import { EdgeRawData } from '../input/edge-raw-data.dto';

export class BoardDTO {
  @ApiProperty({ type: [NodeRawData] })
  readonly nodes: NodeRawData[];

  @ApiProperty({ type: [EdgeRawData] })
  readonly edges: EdgeRawData[];

  constructor(nodes: NodeRawData[], edges: EdgeRawData[]) {
    this.nodes = nodes;
    this.edges = edges;
  }
}
