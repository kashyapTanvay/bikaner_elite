import { createBrowserRouter } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HomePage from "../HomePage/HomePage";
import StaffDashboard from "../StaffDashboard/StaffDashboard";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import ProfilePage from "../ProfilePage/ProfilePage";

export const Root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <RegisterPage />
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    ),
  },
  {
    path: "/staff/*",
    element: <StaffDashboard />,
  },
  {
    path: "/admin/*",
    element: <AdminDashboard />,
  },
]);
