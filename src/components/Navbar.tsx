"use client";

import Link from "next/link";
import React, { useRef } from "react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const nav = useRef<HTMLDivElement>(null);

  const navLinks = [
    {
      text: "All Tools",
      url: "/allTools",
    },
    {
      text: "Text Tools",
      url: "/tools/text",
    },
    {
      text: "Category",
      url: "/category",
    },
    {
      text: "Calculators",
      url: "/tools/calculator",
    },
    {
      text: "PDF Tool",
      url: "/tools/pdf",
    },
  ];

  const navHandler = () => {
    nav.current?.classList.toggle("translate-x-[100%]");
  };
  return (
    <nav className="flex items-center justify-between w-full shadow py-3 px-9">
      <div>
        <Link href={"/"} className="poetsen text-2xl">
          Tool<span className="text-amber-500">sy</span>
        </Link>
      </div>
      <div
        className="fixed top-0 left-0 w-full h-full flex justify-center bg-primary text-white items-center sm:bg-transparent sm:static sm:h-auto sm:w-auto sm:text-black translate-x-[100%] sm:translate-x-[0%] duration-300"
        ref={nav}
      >
        <span className="absolute top-4 right-8 sm:hidden" onClick={navHandler}>
          <X />
        </span>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col font-semibold sm:flex-row">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.text}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.url}
                    className="nav-link"
                    onClick={navHandler}
                  >
                    {link.text}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>{" "}
      <div onClick={navHandler} className="sm:hidden">
        <Menu />
      </div>
    </nav>
  );
};

export default Navbar;
