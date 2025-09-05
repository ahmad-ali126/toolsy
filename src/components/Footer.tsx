import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-muted text-foreground">
      <div className="container-box flex flex-col gap-12 sm:flex-row sm:justify-between">
        {/* Brand Info */}
        <section className="sm:w-[40%] text-center sm:text-left">
          <h1 className="poetsen text-2xl font-bold text-primary">Toolsy</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Toolsy is your free online toolbox — simple, fast, and accessible.
            Save time and share with your friends to make life easier!
          </p>
        </section>

        {/* Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex gap-12 justify-center"
        >
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-lg text-accent">Quick Links</h2>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-lg text-accent">Resources</h2>
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/pages/faqs"
              className="hover:text-primary transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/pages/blogs"
              className="hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </div>
        </nav>

        {/* Newsletter */}
        <section className="flex flex-col items-center sm:items-start">
          <h2 className="font-semibold text-lg mb-2 text-accent">
            Stay Updated
          </h2>
          <form className="flex bg-card rounded-lg overflow-hidden w-full max-w-sm border border-border">
            <label htmlFor="newsletter" className="sr-only">
              Subscribe for newsletter
            </label>
            <input
              type="email"
              id="newsletter"
              placeholder="Enter your email"
              className="flex-grow px-3 py-2 text-sm text-foreground bg-transparent focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border mt-8 pt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Toolsy. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
