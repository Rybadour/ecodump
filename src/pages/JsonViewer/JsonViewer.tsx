import React, { useState } from "react";
import JSONTree from "react-json-tree";
import { getJsonDownloadHref } from '../../utils/downloadFile';
import { FaDownload } from 'react-icons/fa';
import useRestDb from "../../context/useRestDb";
import "./JsonViewer.css";

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const getHref = (key: string, jsonFiles: { [key: string]: unknown }) => getJsonDownloadHref(key, jsonFiles[key]);

export default () => {
  const { jsonFiles } = useRestDb();
  const [filename, setFilename] = useState<string>();
  return (
    <div className="page">
      <h2>Json viewer</h2>
      <div className="wrapper">
        <aside className="menu">
          <ul>
            {Object.keys(jsonFiles).map((key) => (
              <li key={key}>
                <a
                  className={key === filename ? "active" : undefined}
                  onClick={() => setFilename(key)}
                >
                  {key}
                </a>
                <div className="download">
                  <a className="json" {...getHref(key, jsonFiles)}><FaDownload /></a>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <main className="jsonViewer">
          {filename && <JSONTree data={jsonFiles[filename]} theme={theme} invertTheme={true} />}
        </main>
      </div>
    </div>
  );
};
