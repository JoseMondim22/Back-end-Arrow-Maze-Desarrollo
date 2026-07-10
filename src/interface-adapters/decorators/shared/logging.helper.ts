import { ILogger } from '../../../application/ports/logger';
import { ITimeProvider } from '../../../application/ports/time-provider';

export async function runWithLogging<TResult>(
  logger: ILogger,
  timeProvider: ITimeProvider,
  label: string,
  action: () => Promise<TResult>,
): Promise<TResult> {
  const start = timeProvider.now().getTime();
  logger.log(`[${label}] started`);

  try {
    const result = await action();
    const duration = timeProvider.now().getTime() - start;
    logger.log(`[${label}] finished in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = timeProvider.now().getTime() - start;
    logger.log(`[${label}] failed after ${duration}ms: ${(error as Error).message}`);
    throw error;
  }
}
