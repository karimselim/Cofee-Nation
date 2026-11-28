import { Outlet } from "react-router-dom";
import { Footer } from "../../components";

const Auth = () => {
  return (
    <>
      <section className="flex flex-col lg:flex-row">
        <aside className="w-1/2 bg-cover bg-center bg-auth h-screen hidden lg:block fixed z-10"></aside>
        <aside className="bg-auth lg:bg-none bg-cover bg-center min-h-screen flex flex-col lg:w-1/2 lg:absolute lg:right-0">
          <div className=" py-10 lg:px-16 flex justify-center flex-col min-h-screen global-px w-full">
            <section className="rounded-2xl px-5 py-6 lg:p-10 bg-surface border border-line w-full max-w-md mx-auto">
              <Outlet />
            </section>
          </div>
          <Footer />
        </aside>
      </section>
    </>
  );
};

export default Auth;
