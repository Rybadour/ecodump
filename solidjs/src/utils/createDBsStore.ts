import { createSignal, createResource, createEffect } from "solid-js";
import { openDownloadFileDialog } from "./downloadFile";
import { listDBs, readDB } from "./restDbSdk";

export interface DbContent<T> {
  isLoading: boolean;
  isReady: boolean;
  result: T;
}

export default () => {
  console.log("CreateResource");
  const [filenameToDownload, setFilenameToDownload] = createSignal("");
  const [dbs] = createResource(listDBs);
  const [downloadedFile] = createResource(
    filenameToDownload,
    (filename: string) =>
      filename
        ? readDB(filename).then((json) => ({ filename, json }))
        : Promise.resolve(undefined)
  );

  const downloadFile = (filename: string) => {
    console.log("downloading file: " + filename);
    setFilenameToDownload(filename);
  };

  createEffect(() => {
    if (downloadedFile() && downloadedFile()?.filename)
      openDownloadFileDialog(
        downloadedFile()?.filename ?? "download",
        downloadedFile()?.json
      );
    setFilenameToDownload("");
  });
  // createEffect(() => console.log("user", user()));
  //   const [dbs, setdbs] = useState<Dictionary<number>>({});
  //   const [dbContents, setDbContents] = useState<Dictionary<DbContent<unknown>>>({
  //     "animal data": { isLoading: false, isReady: true, result: animalData },
  //     "command data": { isLoading: false, isReady: true, result: commandData },
  //     "crafting recipes": {
  //       isLoading: false,
  //       isReady: true,
  //       result: craftingRecipes,
  //     },
  //     "item data": { isLoading: false, isReady: true, result: itemData },
  //     "plant data": { isLoading: false, isReady: true, result: plantData },
  //     skills: { isLoading: false, isReady: true, result: skills },
  //     "talent data": { isLoading: false, isReady: true, result: talentData },
  //     "tree data": { isLoading: false, isReady: true, result: treeData },
  //   });

  //   const fetchDb = (dbname: string) => {
  //     console.log(`fetching db ${dbname}`);
  //     setDbContents((prev) => ({
  //       ...prev,
  //       [dbname]: { isLoading: true, isReady: false, result: undefined },
  //     }));

  //     readDB(dbname)
  //       .then((result) =>
  //         setDbContents((prev) => ({
  //           ...prev,
  //           [dbname]: {
  //             isLoading: false,
  //             isReady: true,
  //             result: result?.data?.data,
  //           },
  //         }))
  //       )
  //       .catch((e) =>
  //         setDbContents((prev) => ({
  //           ...prev,
  //           [dbname]: { isLoading: false, isReady: false, result: undefined },
  //         }))
  //       );
  //   };

  // Fetch the list of available databases
  //   useEy

  return {
    dbs,
    downloadFile,
  };
};
