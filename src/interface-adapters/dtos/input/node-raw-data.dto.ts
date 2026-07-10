export class NodeRawData {
  constructor(
    readonly id: string,
    readonly type: string,
    readonly row: number,
    readonly column: number,
    readonly direction?: string,
  ) {}
}
