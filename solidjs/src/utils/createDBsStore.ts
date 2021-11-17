import { createSignal, createResource, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { openDownloadFileDialog } from "./downloadFile";
import { listDBs, readDB } from "./restDbSdk";

export interface DbContent<T> {
  isLoading: boolean;
  isReady: boolean;
  result: T;
}

export default () => {
  const [filenameToDownload, setFilenameToDownload] = createSignal("");
  const [dbs] = createResource(listDBs);
  const [downloadedFile] = createResource(
    filenameToDownload,
    (filename: string) =>
      filename
        ? readDB(filename).then((json) => ({ filename, json }))
        : Promise.resolve(undefined)
  );

  createEffect(() => {
    const filename = downloadedFile() && downloadedFile()?.filename;
    if (filename) {
      openDownloadFileDialog(filename, downloadedFile()?.json);
    }
    setFilenameToDownload("");
  });

  return {
    dbs,
    downloadFile: setFilenameToDownload,
  };
};
