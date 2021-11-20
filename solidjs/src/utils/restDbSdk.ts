import { removeXmlTags } from "./helpers";

const key = "425aff9f-2361-4031-b941-91d9b7d58f82";
const endpoints = {
  list: () => `https://api.jsonstorage.net/v1/json/${key}`,
  readDB: (bin: string) => `https://api.jsonstorage.net/v1/json/${bin}`,
};

async function fetchAsync<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return (await response.json()) as T;
}

export const listDBs = () => fetchAsync<Config>(endpoints.list());
export const readDB = (bin: string) => fetchAsync(endpoints.readDB(bin));

export const getStores = (): Promise<StoresResponse | undefined> =>
  listDBs()
    .then((config) => config.Dbs.find((db) => db.Name === "Stores"))
    .then((stores) =>
      stores?.Bin
        ? fetchAsync<StoresResponse>(endpoints.readDB(stores?.Bin)).then(
            (response) => ({
              ...response,
              Stores: response.Stores.map((store) => ({
                ...store,
                Name: removeXmlTags(store.Name),
              })),
            })
          )
        : Promise.resolve(undefined)
    );

export const getRecipes = (): Promise<Recipe[] | undefined> =>
  listDBs()
    .then((config) => config.Dbs.find((db) => db.Name === "Recipes"))
    .then((recipes) =>
      recipes?.Bin
        ? fetchAsync<Recipe[]>(endpoints.readDB(recipes?.Bin))
        : Promise.resolve(undefined)
    );

// export const getTags = () =>
//   fetchAsync<DbResponse<Record<string, string[]>>>(endpoints.readDB("tags"));
