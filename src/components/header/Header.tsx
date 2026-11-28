import { Logo, Nav, SignIn, SideNav } from "./";

const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur-xl">
        <div className="flex justify-between header-px items-center global-px">
          <Logo />
          <Nav />
          <SignIn />
          <SideNav />
        </div>
      </header>
    </>
  );
};

export default Header;
