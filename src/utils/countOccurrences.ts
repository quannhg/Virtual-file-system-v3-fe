export function countOccurrences(text: string, searchString: string) {
  // Escape special characters in the search string
  const escapedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(escapedSearchString, 'g');

  const matches = text.match(regex);

  return matches ? matches.length : 0;
}
