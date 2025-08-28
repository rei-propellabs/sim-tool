import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";
import 'styles/global.css';

export const App = () => (
  <RouterProvider router={router} />
);
