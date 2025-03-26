import "./App.css";
import { Toaster } from "react-hot-toast";
import "@mantine/core/styles.css";
import RouteRenderer from "./utils/routerRenderer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultQueryConfig } from "./lib/queryConfig";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: defaultQueryConfig(),
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-center" />
        <RouteRenderer />
      </QueryClientProvider>
    </>
  );
}

export default App;
