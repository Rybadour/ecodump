import {
  createSignal,
  createResource,
  createEffect,
  createMemo,
} from "solid-js";
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
  const [config] = createResource(listDBs);
  const [downloadedFile] = createResource(
    filenameToDownload,
    (filename: string) => {
      const bin =
        filename && config()?.dbs.find((db) => db.Name === filename)?.Bin;
      return filename && bin
        ? readDB(bin).then((json) => ({ filename, json }))
        : Promise.resolve(undefined);
    }
  );

  createEffect(() => {
    const filename = downloadedFile() && downloadedFile()?.filename;
    if (filename) {
      openDownloadFileDialog(filename, downloadedFile()?.json);
    }
    setFilenameToDownload("");
  });

  const dbs = createMemo(() => config()?.dbs);

  return {
    dbs,
    downloadFile: setFilenameToDownload,
  };
};
