// components/ToolCategories.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; // optional if you’re using cn
import { toolCategories } from "../data/Categories";

export function ToolCategories() {
  return (
    <section className=" container-box">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gradient">
        Tool Categories
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {toolCategories.map((cat, i) => (
          <Link
            key={i}
            href={`/tools/${cat.slug}`}
            className="group rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col card-hover"
          >
            <div
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white font-bold text-lg",
                cat.color
              )}
            >
              {cat.icon}
            </div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {cat.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
