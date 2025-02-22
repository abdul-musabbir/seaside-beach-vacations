import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import React Query
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Preloader from "./components/Preloader.tsx"; // Import Preloader
import ReviewSliderSinglePage from "./components/ReviewSliderSinglePage.tsx";
import "./index.css";
import { DataProvider } from "./lib/dataContext.tsx";
import Checkout from "./pages/Checkout.tsx";
import House from "./pages/House.tsx";
import SinglePage from "./pages/SinglePage.tsx";

// Lazy loading for NotFound component
const NotFound = React.lazy(() => import("./pages/NotFound.tsx"));

// Create a new QueryClient instance
const queryClient = new QueryClient();

const routerProvider = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:id",
    element: <SinglePage />,
  },
  {
    path: "/house",
    element: <House />,
  },
  {
    path: "/slider",
    element: <ReviewSliderSinglePage />,
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<Preloader />}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Preloader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <DataProvider>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Preloader />}>
        {" "}
        {/* Wrap entire Router with Suspense and Preloader */}
        <RouterProvider router={routerProvider} />
      </Suspense>
    </QueryClientProvider>
  </DataProvider>
);
