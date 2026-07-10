export class SyncProgressCommand {
  constructor(
    readonly userId: string,
    readonly levelId: string,
    readonly score: number,
  ) {}
}
