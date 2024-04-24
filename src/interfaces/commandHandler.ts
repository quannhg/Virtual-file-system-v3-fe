export interface CommandHandler {
  (...args: string[]): Promise<string | void>;
}
