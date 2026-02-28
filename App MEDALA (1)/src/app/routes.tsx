import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { LogEntry } from "./pages/LogEntry";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "log-entry", element: <LogEntry /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);