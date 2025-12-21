import { createBrowserRouter } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HomePage from "../HomePage/HomePage";

export const Root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  // {
  //   path: "/login",
  //   element: (
  //     <Layout>
  //       <LoginPage />
  //     </Layout>
  //   ),
  // },
  // {
  //   path: "/staff/*",
  //   element: <StaffDashboard />,
  // },
  // {
  //   path: "/admin/*",
  //   element: <AdminDashboard />,
  // },
]);
