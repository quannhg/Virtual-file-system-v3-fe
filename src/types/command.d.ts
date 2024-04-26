interface CommandHandler {
  (args: string): Promise<JSX.Element | undefined> | JSX.Element | undefined;
}

type Commands = { [name: string]: CommandHandler };
