import React, { useState } from "react";
import JSONTree from "react-json-tree";
import recipes from "../utils/recipes";
import "./JsonViewer.css";
const json = {
  array: [1, 2, 3],
  bool: true,
  object: {
    foo: "bar",
  },
};

const jsonFiles = {
  "crafting recipes": recipes,
  test: json,
} as { [key: string]: unknown };

export default () => {
  const [filename, setFilename] = useState<string>();
  return (
    <div>
      <h2>Json viewer</h2>
      <div className="wrapper">
        <aside className="menu">
          <ul>
            {Object.keys(jsonFiles).map((key) => (
              <li>
                <a
                  className={key === filename ? "active" : undefined}
                  onClick={() => setFilename(key)}
                >
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <main className="jsonViewer">
          {filename && <JSONTree data={jsonFiles[filename]} />}
        </main>
      </div>
    </div>
  );
};
