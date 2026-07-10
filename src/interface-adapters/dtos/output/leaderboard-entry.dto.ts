export class LeaderboardEntryDTO {
  constructor(
    readonly position: number,
    readonly username: string,
    readonly score: number,
  ) {}
}
