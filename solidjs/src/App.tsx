import type { Component } from "solid-js";
import { lazy, createMemo } from "solid-js";
import { Routes, Route, useLocation } from "solid-app-router";
import Navbar from "./Navbar/Navbar";

const Recipes = lazy(() => import("./pages/recipes/index"));
const RawData = lazy(() => import("./pages/RawData/index"));
const Home = lazy(() => import("./pages/home/index"));

const routes = {
  Home: { text: "Home", description: "", href: "/" },
  Recipes: { text: "Recipes", description: "", href: "/recipes" },
  RawData: {
    text: "Raw data",
    description:
      "Download the raw files that this app uses for your own personal uses",
    href: "/rawData",
  },
  // Items: { text: "Items", description: "", href: "/items" },
  // Currencies: { text: "Currencies", description: "", href: "/currencies" },
  // Stores: { text: "Stores", description: "", href: "/stores" },
} as { [key: string]: { text: string; description: string; href: string } };

const App: Component = () => {
  const location = useLocation();
  console.log("l", location.pathname);

  const routesConfig = createMemo(() =>
    Object.keys(routes).map((key) => ({
      ...routes[key],
      highlight: location.pathname === routes[key].href,
    }))
  );

  // createEffect(() => console.log("routesConfig", routesConfig()));

  const currentRoute = createMemo(() =>
    routesConfig().find((t) => t.highlight)
  );

  return (
    <div class="min-h-full">
      <Navbar routes={routesConfig()} />
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {currentRoute()?.text}
          </h1>
          <span>{currentRoute()?.description}</span>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <Routes>
              <Route path={routes.Recipes.href} element={<Recipes />} />
              <Route path={routes.RawData.href} element={<RawData />} />
              <Route path="/" element={<Home />} />
              <Route path="/*all" element={<Home />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
