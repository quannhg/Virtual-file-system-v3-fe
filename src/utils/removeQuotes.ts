export function removeQuotes(argument: string) {
  let cleanedArgument = argument;
  if (cleanedArgument.startsWith('"') && cleanedArgument.endsWith('"')) {
    cleanedArgument = cleanedArgument.slice(1, -1);
  }
  if (cleanedArgument.startsWith("'") && cleanedArgument.endsWith("'")) {
    cleanedArgument = cleanedArgument.slice(1, -1);
  }
  return cleanedArgument;
}
