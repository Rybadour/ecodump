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
        <h2>Changelog</h2>
        <h3>0.1.2 (2020-12-30)</h3>
        <h4>Features</h4>
        <ul>
          <li>add skill and table requirements on item recipe popover</li>
          <li>add table/profession requirement in recipes popover</li>
          <li>replace recipes dropdown in item list</li>
        </ul>
        <h4>Bug Fixes</h4>
        <ul>
          <li>craft amount is now working as expected</li>
        </ul>
        <h3>0.1.1 (2020-12-29)</h3>
        <h4>Features</h4>
        <ul>
          <li>add game prices column on all items table</li>
          <li>added game prices on all items tab and added tooltips</li>
          <li>added recipe filter. Improved filter performance.</li>
          <li>duplicate currency prices</li>
          <li>improvements on popovers</li>
          <li>show game prices in currency view</li>
        </ul>
        <h4>Bug Fixes</h4>
        <ul>
          <li>added close button on recipe popover</li>
          <li>updated fixed price column on all items page</li>
          <li>workaround for variants without key</li>
        </ul>
      </div>
    </div>
  );
};
