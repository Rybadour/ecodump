const removeTagsRegex = /(<([^>]+)>)/gi;
export const removeXmlTags = (name: string) =>
  name.replace(removeTagsRegex, "");

export const filterByText = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase()?.indexOf(valueFilter?.toLowerCase()) >= 0;

export const filterByTextEqual = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase() === valueFilter?.toLowerCase();

export const filterByIncludesAny = (
  valuesToFilter: string[],
  values: string[]
) =>
  valuesToFilter.length === 0 ||
  valuesToFilter[0].length === 0 ||
  valuesToFilter.some((t) => values.includes(t));

export const filterUnique = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const paginateArray = <T>(
  currentPage: number,
  pageSize: number,
  items?: T[]
) => items?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

export const calcTotalPages = <T>(pageSize: number, items?: T[]) =>
  Math.ceil((items?.length ?? 0) / pageSize);

export const formatNumber = (num: number) => +num.toFixed(2);

export const sortByText = (a: string, b: string) =>
  a.toLowerCase().localeCompare(b.toLowerCase());

export const sortByTextExcludingWord =
  (word: string) => (a: string, b: string) => {
    const aContainsWord = a.indexOf(word) >= 0;
    const bContainsWord = b.indexOf(word) >= 0;
    // aContainsWord XOR bContainsWord
    if ((aContainsWord && bContainsWord) || (!aContainsWord && !bContainsWord))
      return a.toLowerCase().localeCompare(b.toLowerCase());

    return aContainsWord ? 1 : -1;
  };
