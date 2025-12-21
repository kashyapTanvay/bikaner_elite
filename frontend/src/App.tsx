import { memo } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Root } from "./Pages/Root/Root";

const App = memo(() => {
  return <RouterProvider router={Root} />;
});

export default App;
