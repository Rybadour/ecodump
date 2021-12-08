import { removeXmlTags } from "./helpers";

const endpoints = {
  list: () =>
    `https://api.jsonstorage.net/v1/json/${
      import.meta.env.VITE_STORAGE_MASTERKEY
    }`,
  readDB: (bin: string) => `https://api.jsonstorage.net/v1/json/${bin}`,
};

async function fetchAsync<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    return (await response.json()) as T;
  } catch (e) {
    console.log(`Could not fetch from ${url}`);
  }
  return {} as T;
}

export const listDBs = () => fetchAsync<Config>(endpoints.list());
export const readDB = (bin: string) => fetchAsync(endpoints.readDB(bin));

export const getStores = (
  storesBin: string
): Promise<StoresResponse | undefined> =>
  !storesBin
    ? Promise.resolve(undefined)
    : fetchAsync<StoresResponse>(endpoints.readDB(storesBin)).then(
        (response) => ({
          ...response,
          Stores: response.Stores.map((store) => ({
            ...store,
            Name: removeXmlTags(store.Name),
          })),
        })
      );

export const getRecipes = (recipesBin: string): Promise<Recipe[] | undefined> =>
  !recipesBin
    ? Promise.resolve(undefined)
    : fetchAsync<Recipe[]>(endpoints.readDB(recipesBin));

export const getTags = (tagsBin: string) =>
  !tagsBin
    ? Promise.resolve(undefined)
    : fetchAsync<Record<string, string[]>>(endpoints.readDB(tagsBin));
