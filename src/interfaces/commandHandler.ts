export interface CommandHandler {
  (...args: string[]): string | void;
}
