import { test as base } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { ProductsPage } from "../pages/shop/productsPage";
import { ProductDetailsPage } from "../pages/shop/productDetailsPage";
import { CartPage } from "../pages/shop/cartPage";
import { WishlistPage } from "../pages/shop/wishlistPage";
import { LoginPage } from "../pages/auth/loginPage";
import { SignupPage } from "../pages/auth/signupPage";
import { MessagesPage } from "../pages/shop/messagesPage";
import { HistoryPage } from "../pages/shop/historyPage";
import { AccountMenu } from "../pages/components/accountMenu";
import { Toast } from "../pages/components/toast";

type UiFixtures = {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  wishlistPage: WishlistPage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  messagesPage: MessagesPage;
  historyPage: HistoryPage;
  accountMenu: AccountMenu;
  toast: Toast;
};

export const test = base.extend<UiFixtures>({
  homePage: async ({ page }, use) => await use(new HomePage(page)),
  productsPage: async ({ page }, use) => await use(new ProductsPage(page)),
  productDetailsPage: async ({ page }, use) => await use(new ProductDetailsPage(page)),
  cartPage: async ({ page }, use) => await use(new CartPage(page)),
  wishlistPage: async ({ page }, use) => await use(new WishlistPage(page)),
  loginPage: async ({ page }, use) => await use(new LoginPage(page)),
  signupPage: async ({ page }, use) => await use(new SignupPage(page)),
  messagesPage: async ({ page }, use) => await use(new MessagesPage(page)),
  historyPage: async ({ page }, use) => await use(new HistoryPage(page)),
  accountMenu: async ({ page }, use) => await use(new AccountMenu(page)),
  toast: async ({ page }, use) => await use(new Toast(page)),
});

export { expect } from "@playwright/test";
