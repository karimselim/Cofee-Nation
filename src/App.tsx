import {
  History,
  Home,
  Products,
  YourCart,
  Login,
  Register,
  Auth,
  ForgotPassword,
} from "./pages";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import { Addons, CategoryPage, ProductsDetails } from "./pages/products";
import { ErrorComponent } from "./components";
import { LoggedInProtectedRoute, ProtectedRoute } from "./pages/auth";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorComponent />}>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />

        <Route path="/products" element={<Products />}>
          <Route index element={<CategoryPage />} />
          <Route path="1" element={<CategoryPage category="coffee" />} />
          <Route path="2" element={<CategoryPage category="iced" />} />
          <Route path="3" element={<CategoryPage category="foods" />} />
          <Route path="4" element={<Addons />} />
        </Route>

        <Route path="/products/:cat/:id" element={<ProductsDetails />} />
        <Route path="yourCart" element={<YourCart />} />
        <Route path="*" element={<ErrorComponent />} />
        <Route
          path="history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="auth"
        element={
          <LoggedInProtectedRoute>
            <Auth />
          </LoggedInProtectedRoute>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
      </Route>
    </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
