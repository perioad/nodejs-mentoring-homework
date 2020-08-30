const parse = (obj: any) => {
  let keysAndValues: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    keysAndValues = [...keysAndValues, `${key}='${value}'`];
  }
  return keysAndValues.join(', ');
}

export const parseRequestArguments = (requestBody: any, requestQuery: any): string | boolean => {
  const parsedBody: string = parse(requestBody);
  const isBodyArguments: boolean = parsedBody.length > 0;
  const parsedQuery: string = parse(requestQuery);
  const isQueryArguments: boolean = parsedQuery.length > 0;
  if (isBodyArguments && !isQueryArguments) {
    return `body arguments: ${parsedBody} and no query arguments`;
  }
  if (!isBodyArguments && isQueryArguments) {
    return `query arguments: ${parsedQuery} and no body arguments`;
  }
  if (isBodyArguments && isQueryArguments) {
    return `body arguments: ${parsedBody} and query arguments: ${parsedQuery}`;
  }
  return false;
}