import { Link } from "react-router-dom";
import jokopi from "../assists/jokopi.svg";
import faceBook from "../assists/icons/facebook.svg";
import twitter from "../assists/icons/twitter.svg";
import instagram from "../assists/icons/instagram.svg";

const Footer = ({ className = "" }: { className?: string }) => {
  return (
    <footer className={`bg-footerColor border-t border-line ${className}`}>
      <div className="flex flex-col md:flex-row flex-wrap gap-12 gap-y-10 justify-between global-px pt-8 md:pt-16 text-center pb-8">
        <div className="flex flex-col text-left gap-4 min-w-0">
          <div className="logo">
            <Link to="/" className="border-none flex gap-3 font-bold items-center">
              <span className="grid place-items-center w-11 h-11 rounded-full border border-accent/60 bg-surface">
                <img src={jokopi} alt="" className="w-7" />
              </span>
              <span className="uppercase tracking-[0.18em] text-ink text-base">
                Coffee Nation
              </span>
            </Link>
          </div>
          <div className="text-textColor md:w-96 text-sm leading-6">
            Coffee Nation is a store that sells some good meals, and especially coffee.
            We provide high quality beans
          </div>
          <div className="icons flex items-center gap-4">
            <Link to="/" aria-label="Facebook" className="icon bg-surface border border-line hover:border-accent rounded-full items-center justify-center duration-200">
              <img src={faceBook} alt="" className="z-10 w-9" />
            </Link>
            <Link to="/" aria-label="Instagram" className="icon bg-surface border border-line hover:border-accent rounded-full items-center justify-center duration-200">
              <img src={instagram} alt="" className="z-10 w-9" />
            </Link>
            <Link to="/" aria-label="Twitter" className="icon bg-surface border border-line hover:border-accent rounded-full items-center justify-center duration-200">
              <img src={twitter} alt="" className="z-10 w-9" />
            </Link>
          </div>
          <p className="text-muted text-sm">© 2023 Coffee Nation</p>
        </div>
        <div className="flex flex-wrap gap-12 md:gap-16 lg:gap-32">
          <div className="right flex flex-col gap-2 text-left">
            <h4 className="uppercase text-xs tracking-[0.2em] text-ink mb-3">product</h4>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Download
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Pricing
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Locations
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Countries
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Blog
            </a>
          </div>
          <div className="left flex flex-col gap-2 text-left">
            <h4 className="uppercase text-xs tracking-[0.2em] text-ink mb-3">Engage</h4>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Coffee Shop ?
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              FAQ
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              About Us
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Privacy Policy
            </a>
            <a href="/" className="text-footerTextColor/70 hover:text-accent text-sm duration-200">
              Terms of Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
