import { ApiProperty } from '@nestjs/swagger';
import { NodeRawData } from '../input/node-raw-data.dto';
import { EdgeRawData } from '../input/edge-raw-data.dto';
import { ChainRawData } from '../input/chain-raw-data.dto';

export class BoardDTO {
  @ApiProperty({ type: [NodeRawData] })
  readonly nodes: NodeRawData[];

  @ApiProperty({ type: [EdgeRawData] })
  readonly edges: EdgeRawData[];

  @ApiProperty({ type: [ChainRawData] })
  readonly chains: ChainRawData[];

  constructor(nodes: NodeRawData[], edges: EdgeRawData[], chains: ChainRawData[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.chains = chains;
  }
}
