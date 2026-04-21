import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  { path: "/home", element: <Header /> },
  { path: "/", element: <Layout /> },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
// <AddCustomer /> , <Layout />, <Dashboard /> , <AddCustomer />
