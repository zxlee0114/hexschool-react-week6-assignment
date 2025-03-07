import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layout/FrontLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import CartPage from "../pages/CartPage";
import ProductDetailPage from "../pages/ProductsDetailPage";
import NotFoundPage from "../pages/NotFoundPage";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
