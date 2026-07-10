export interface IUseCase<TCommand> {
  execute(command: TCommand): Promise<void>;
}
