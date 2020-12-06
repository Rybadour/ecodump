import React from "react";
import Home from "./pages/Home";
import JsonViewer from "./pages/JsonViewer";
import AllItems from "./pages/AllItems";
import { Menu } from "antd";
import { HomeOutlined, FileOutlined, TableOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppProvider } from "./AppContext";

import "./App.css";

const routes = {
  JsonViewer: "/jsonViewer",
  Recipes: "/recipes",
  Items: "/items",
  Home: "/",
};

function App() {
  return (
    <div className="App">
      <Router>
        <Menu mode="horizontal">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to={routes.Home}>Home</Link>
          </Menu.Item>
          <Menu.Item key="jsonViewer" icon={<FileOutlined />}>
            <Link to={routes.JsonViewer}>Json viewer</Link>
          </Menu.Item>
          <Menu.Item key="Items" icon={<TableOutlined />}>
            <Link to={routes.Items}>All items</Link>
          </Menu.Item>
        </Menu>
        <Switch>
          <AppProvider>
            <Route path={routes.JsonViewer}>
              <JsonViewer />
            </Route>
            <Route path={routes.Items}>
              <AllItems />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </AppProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
