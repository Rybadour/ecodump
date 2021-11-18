import { removeXmlTags } from "./helpers";

const key = "fa89590a-2849-4563-aa75-a960d2e11c6f";
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

// export const getStoresLastUpdate = () =>
//   fetchAsync<DbResponse<number>>(
//     endpoints.readDB("stores", "/ExportedAt/Ticks")
//   );

export const getStores = (): Promise<StoresResponse | undefined> =>
  listDBs()
    .then((config) => config.dbs.find((t) => t.Name === "Stores"))
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

// export const getRecipes = () =>
//   fetchAsync<DbResponse<RecipeV1[]>>(endpoints.readDB("recipes"));

// export const getTags = () =>
//   fetchAsync<DbResponse<Record<string, string[]>>>(endpoints.readDB("tags"));
