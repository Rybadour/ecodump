import React from "react";
import "./Home.css";
export default () => {
  return (
    <div style={{ textAlign: "left", padding: "3rem" }}>
      <p>Hello and welcome,</p>
      <p>
        I go by the nicknames of <i>Ucat</i> and <i>Fon</i> and i've been
        building this tool on my spare time. You can contact me using discord,
        my handle is Fon#2880
      </p>
      <p>
        <b>Json viewer</b> is where you can download the raw files i use on this
        tool to check raw data or to create your own tool.
      </p>
      <p>
        <b>All items</b> is where you can find all items on the game as well as
        their recipes. It also allows you to input item prices and uses the
        recipe data to help you calculate your price for items. I got this data
        using the&nbsp;
        <a href="https://github.com/ZeelNightwolf/EcoDataExporter">
          EcoDataExporter
        </a>
        &nbsp;plugin.
      </p>
      <p>
        This is very much a work in progress and more sections should be added
        later.
      </p>
      <p>So stay tuned. And i hope you enjoy it</p>
      <br />
      <br />
      <div className="changelog">
        <h2>Latest changes</h2>
        <h3>1.4.0 (2021-06-18)</h3>
        <h4>Features</h4>
        <ul>
          <li>Read tags exported from game (instead of static files)</li>
          <li>
            Added icons for extra visibility: multi recipe and tags menu's
          </li>
        </ul>
        <h3>1.3.0 (2021-06-15)</h3>
        <h4>Features</h4>
        <ul>
          <li>Read recipes exported from game (instead of static files)</li>
        </ul>
        <h4>Fix</h4>
        <ul>
          <li>Fixed recipe name showing up as item name</li>
        </ul>
      </div>
    </div>
  );
};
