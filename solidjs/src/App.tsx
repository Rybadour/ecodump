import type { Component } from "solid-js";
import { lazy, createMemo } from "solid-js";
import { Routes, Route, useLocation } from "solid-app-router";
import Navbar from "./Navbar/Navbar";
import PriceCalculator from "./pages/PriceCalculator";
import { MainContextProvider } from "./hooks/MainContext";

const Market = lazy(() => import("./pages/Market"));
const RawData = lazy(() => import("./pages/RawData"));
const Home = lazy(() => import("./pages/home"));

const routes = {
  Home: { text: "Home", description: "", href: "/" },
  // Recipes: { text: "Recipes", description: "", href: "/recipes" },
  PriceCalculator: {
    text: "Price Calculator",
    description:
      "Allows calculation of price for products in a recipe based on all ingredients / raw materials necessary",
    href: "/calculator",
  },
  Market: {
    text: "Ingame market",
    description: "Buy/sell orders of all stores ingame",
    href: "/market",
  },
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

  const routesConfig = createMemo(() =>
    Object.keys(routes).map((key) => ({
      ...routes[key],
      highlight: location.pathname === routes[key].href,
    }))
  );

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
            <MainContextProvider>
              <Routes>
                {/* <Route path={routes.Recipes.href} element={<Recipes />} /> */}
                <Route
                  path={routes.PriceCalculator.href}
                  element={<PriceCalculator />}
                />
                <Route path={routes.Market.href} element={<Market />} />
                <Route path={routes.RawData.href} element={<RawData />} />
                <Route path="/" element={<Home />} />
                <Route path="/*all" element={<Home />} />
              </Routes>
            </MainContextProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
