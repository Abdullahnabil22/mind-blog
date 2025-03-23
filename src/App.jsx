import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import { routes } from "./routes";
import { Toaster } from "react-hot-toast";

import "@mantine/core/styles.css";
function App() {
  const location = useLocation();

  return (
    <>
      <Toaster position="top-center" />

      <Routes location={location} key={location.pathname}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children?.map((childRoute) => (
              <Route
                key={childRoute.path || "index"}
                index={childRoute.index}
                path={childRoute.path}
                element={childRoute.element}
              >
                {childRoute.children?.map((grandChildRoute) => (
                  <Route
                    key={grandChildRoute.path || "index"}
                    index={grandChildRoute.index}
                    path={grandChildRoute.path}
                    element={grandChildRoute.element}
                  />
                ))}
              </Route>
            ))}
          </Route>
        ))}
      </Routes>
    </>
  );
}

export default App;
