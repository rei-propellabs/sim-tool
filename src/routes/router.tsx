import { AdminLoginPage } from "pages/AdminLoginPage/AdminLoginPage";
import ProtectedRoute from "pages/ProtectedRoute";
import ClientLoginPage from "pages/ClientLoginPage/ClientLoginPage";
import { type RouteObject, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { UploadFilesPage } from "pages/UploadFiles/UploadFilesPage";
import { CompanyListPage } from "pages/CompanyListPage/CompanyListPage";
import { EditCompanyPage } from "pages/EditCompanyPage/EditCompanyPage";
import { SiteListPage } from "pages/SiteListPage/SiteListPage";
import { EditSitePage } from "pages/EditSitePage/EditSitePage";
import { ProjectListPage } from "pages/ProjectList/ProjectListPage";
import { EditProjectPage } from "pages/EditProjectPage/EditProjectPage";
import { UploadProjectListPage } from "pages/UploadProjectListPage/UploadProjectListPage"
import { MagicLink } from "pages/MagicLink/MagicLink";
import { CompanyDetailsPage } from "pages/CompanyDetailsPage/CompanyDetailsPage";
import { UploadFilesAdminPage } from "pages/UploadFiles/UploadFilesAdminPage";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ClientProtectedRoute from "./ClientProtectedRoute";
import { FinancialSimulationPage } from "pages/FinancialSimulationPage/FinancialSimulationPage";

const router: RouteObject[] = [
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "auth",
        children: [
          { path: "magic", element: <MagicLink /> }
        ],
      },
      {
        path: "upload",
        children: [
          { path: "auth", element: <ClientLoginPage /> },
          {
            element: <ClientProtectedRoute />,
            children: [
              {  index: true, path: "project", element: <UploadProjectListPage /> },
              { path: "files", element: <UploadFilesPage /> },
            ],
          }
        ]
      },
      {
        path: "admin",
        children: [
          { path: "auth", element: <AdminLoginPage /> },
          {
            element: <AdminProtectedRoute />,
            children: [
              { index: true, element: <CompanyListPage /> },
              { path: "s", element: <SiteListPage /> },
              { path: "c", element: <CompanyDetailsPage /> },
              { path: "c/form", element: <EditCompanyPage /> },
              { path: "s/form", element: <EditSitePage /> },
              { path: "p", element: <ProjectListPage /> },
              { path: "p/form", element: <EditProjectPage /> },
              { path: "upload", element: <UploadFilesAdminPage /> },
              { path: "scenarios", element: <FinancialSimulationPage /> },
            ]
          }
        ]
      }
    ],
  },
];

export default createBrowserRouter(router);
