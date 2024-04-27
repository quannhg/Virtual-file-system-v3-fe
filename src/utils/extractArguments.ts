export function extractArguments(argsString: string): string[] | undefined {
  const tokens = [];
  while (true) {
    const tokenRes = getNextToken(argsString);
    if (tokenRes.invalid) {
      return undefined;
    }
    const { token, remaining } = tokenRes;
    if (token === '' && remaining === '') {
      break;
    }
    tokens.push(token);
    argsString = remaining;
  }
  return tokens;
}

function getNextToken(
  argsString: string
): { invalid: false; token: string; remaining: string } | { invalid: true } {
  argsString = argsString.trimStart();
  if (argsString.length === 0) {
    return { invalid: false, token: '', remaining: '' };
  }
  let token = '';
  let isInDoubleQuote = false;
  let isInSingleQuote = false;
  for (let i = 0; i < argsString.length; ++i) {
    const char = argsString[i];
    switch (char) {
      case '"': {
        token += '"';
        if (isInDoubleQuote) {
          isInDoubleQuote = false;
        } else if (!isInSingleQuote) {
          isInDoubleQuote = true;
        }
        break;
      }
      case "'": {
        token += "'";
        if (isInSingleQuote) {
          isInSingleQuote = false;
        } else if (!isInDoubleQuote) {
          isInSingleQuote = true;
        }
        break;
      }
      case ' ': {
        if (isInDoubleQuote || isInSingleQuote) {
          token += ' ';
        } else {
          return { invalid: false, token, remaining: argsString.slice(i) };
        }
        break;
      }
      case '\\': {
        i += 1;
        if (argsString[i] === undefined) {
          return { invalid: true };
        }
        const nextChar = argsString[i];
        switch (nextChar) {
          case ' ':
            token += ' ';
            break;
          case 't':
            token += '\t';
            break;
          case 'r':
            token += '\r';
            break;
          case "'":
            token += "'";
            break;
          case '"':
            token += '"';
            break;
          default:
            return { invalid: true };
        }
        break;
      }
      default:
        token += char;
    }
  }
  if (isInDoubleQuote || isInSingleQuote) {
    return { invalid: true };
  }
  return { invalid: false, token, remaining: '' };
}
