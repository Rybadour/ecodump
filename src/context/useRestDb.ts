import { useEffect, useState } from "react";
import { listDBs, readDB } from "../sdk/restDbSdk";
import recipes from "../utils/recipes";

export interface DbContent<T> {
  isLoading: boolean;
  isReady: boolean;
  result: T;
}

export default () => {
  const [dbs, setdbs] = useState<Dictionary<number>>({});
  const [dbContents, setDbContents] = useState<Dictionary<DbContent<unknown>>>({
    "crafting recipes": { isLoading: false, isReady: true, result: recipes },
  });

  const fetchDb = (dbname: string) => {
    console.log(`fetching db ${dbname}`);
    setDbContents((prev) => ({
      ...prev,
      [dbname]: { isLoading: true, isReady: false, result: undefined },
    }));

    readDB(dbname)
      .then((result) =>
        setDbContents((prev) => ({
          ...prev,
          [dbname]: {
            isLoading: false,
            isReady: true,
            result: result?.data?.data,
          },
        }))
      )
      .catch((e) =>
        setDbContents((prev) => ({
          ...prev,
          [dbname]: { isLoading: false, isReady: false, result: undefined },
        }))
      );
  };

  // Fetch the list of available databases
  useEffect(() => {
    listDBs().then((dbs) => setdbs(dbs?.data?.data));
  }, [setdbs]);

  // Preemptevely fetches all available databases
  useEffect(() => {
    console.log("dbContents", dbs);
    Object.entries(dbs).forEach(([dbname]) => fetchDb(dbname));
  }, [dbs]);

  return {
    jsonFiles: dbContents,
  };
};
