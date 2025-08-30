"use client";

import Link from "next/link";
import { popularToolsForFinance } from "./FInanceToolData";
import { cn } from "@/lib/utils"; // optional if you’re using cn

export default function page() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Tool Categories</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {popularToolsForFinance.map((cat, i) => (
          <Link
            key={i}
            href={`/tools/finance/${cat.slug}`}
            className="group rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col card-hover"
          >
            <div
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-lg mb-4 text-white font-bold text-lg",
                cat.color
              )}
            >
              {cat.name.charAt(0)}
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
