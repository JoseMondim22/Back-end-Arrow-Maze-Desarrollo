export class GetLeaderboardQuery {
  constructor(
    readonly levelId: string,
    readonly limit: number,
  ) {}
}
