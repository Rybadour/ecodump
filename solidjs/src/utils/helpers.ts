const removeTagsRegex = /(<([^>]+)>)/gi;
export const removeXmlTags = (name: string) =>
  name.replace(removeTagsRegex, "");

export const filterByText = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase()?.indexOf(valueFilter?.toLowerCase()) >= 0;

export const filterByTextEqual = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase() === valueFilter?.toLowerCase();

export const filterUnique = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const sortByTextExcludingWord =
  (word: string) => (a: string, b: string) => {
    const aContainsWord = a.indexOf(word) >= 0;
    const bContainsWord = b.indexOf(word) >= 0;
    // aContainsWord XOR bContainsWord
    if ((aContainsWord && bContainsWord) || (!aContainsWord && !bContainsWord))
      return a.toLowerCase().localeCompare(b.toLowerCase());

    return aContainsWord ? 1 : -1;
  };
