export interface CommandHandler {
  (...args: string[]): Promise<string | void | Record<string, string | string[] | number>>;
}
