export interface IQueryService<TQuery, TResult> {
  execute(query: TQuery): Promise<TResult>;
}
