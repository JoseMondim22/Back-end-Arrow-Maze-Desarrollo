export interface ICommandService<TCommand> {
  execute(command: TCommand): Promise<void>;
}
