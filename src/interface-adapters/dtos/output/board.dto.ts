import { NodeRawData } from '../input/node-raw-data.dto';
import { EdgeRawData } from '../input/edge-raw-data.dto';

export class BoardDTO {
  constructor(
    readonly nodes: NodeRawData[],
    readonly edges: EdgeRawData[],
  ) {}
}
