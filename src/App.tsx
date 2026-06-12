import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Dashboard /> },
      { path: "customers", element: <Customers /> },
      { path: "customers/add", element: <AddCustomer /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}