import { lazy } from "react";
import { LazyComponent } from "./lib/lazyComponent";
import { ProtectedRoute } from "./hooks/protectedRoutes";

const Layout = lazy(() =>
  import("./components/Layout/layout").then((module) => ({
    default: module.default || module.Layout,
  }))
);
const Home = lazy(() =>
  import("./components/Home/home").then((module) => ({
    default: module.default || module.Home,
  }))
);

const Login = lazy(() =>
  import("./components/Login/login").then((module) => ({
    default: module.default || module.Login,
  }))
);

const profile = lazy(() =>
  import("./components/Profile/profile").then((module) => ({
    default: module.default || module.Profile,
  }))
);

const email = lazy(() =>
  import("./components/emilComp/VerifyEmail").then((module) => ({
    default: module.default || module.VerifyEmail,
  }))
);

const notFound = lazy(() =>
  import("./components/NotFound/notFound").then((module) => ({
    default: module.default || module.NotFound,
  }))
);
const dashboardLayout = lazy(() =>
  import("./components/Dashboard/dashLayout").then((module) => ({
    default: module.default || module.DashLayout,
  }))
);
const dashboard = lazy(() =>
  import("./components/Dashboard/main").then((module) => ({
    default: module.default || module.Dashboard,
  }))
);
export const routes = [
  {
    path: "/",
    element: <LazyComponent component={Layout} />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <LazyComponent component={Home} />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <LazyComponent component={Login} />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <LazyComponent component={profile} />
          </ProtectedRoute>
        ),
      },
      {
        path: "verify-email",
        element: <LazyComponent component={email} />,
      },
      {
        path: "*",
        element: <LazyComponent component={notFound} />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <LazyComponent component={dashboardLayout} />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <LazyComponent component={dashboard} />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
