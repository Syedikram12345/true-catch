import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreatePopup from "./pages/CreatePopup";
import MyPopups from "./pages/MyPopups";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-popup",
    element: (
      <ProtectedRoute>
        <CreatePopup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-popups",
    element: (
      <ProtectedRoute>
        <MyPopups />
      </ProtectedRoute>
    ),
  },
]);

export default router;
