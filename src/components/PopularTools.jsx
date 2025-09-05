// components/PopularTools.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; // optional helper if you have it
import { popularTools } from "../data/PopularTools";

export function PopularTools() {
  return (
    <section className="container-box">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gradient">
        Popular Tools
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {popularTools.map((tool, i) => (
          <Link
            key={i}
            href={`/tools/${tool.category}/${tool.slug}`}
            className="group rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col card-hover"
          >
            <div
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white font-bold text-lg",
                tool.color
              )}
            >
              {tool.name.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
