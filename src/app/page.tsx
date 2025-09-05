import { Suspense, lazy } from "react";
import Head from "next/head";

// Lazy load components to reduce initial bundle size
const PopularTools = lazy(() =>
  import("../components/PopularTools").then((module) => ({
    default: module.PopularTools,
  }))
);

const ToolCategories = lazy(() =>
  import("../components/ToolCategory").then((module) => ({
    default: module.ToolCategories,
  }))
);

const FaqSection = lazy(() =>
  import("../components/faqSection").then((module) => ({
    default: module.FaqSection,
  }))
);

// Loading component for suspense fallback
const LoadingPlaceholder = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Search For Tool - Discover Powerful Online Tools</title>
        <meta
          name="description"
          content="Discover, explore, and use powerful online tools in one place — fast, simple, and free."
        />
        <meta
          name="keywords"
          content="online tools, free tools, web utilities"
        />
        <meta
          property="og:title"
          content="Search For Tool - Discover Powerful Online Tools"
        />
        <meta
          property="og:description"
          content="Discover, explore, and use powerful online tools in one place — fast, simple, and free."
        />
        <link rel="canonical" href="https://localhost:3000/" />
      </Head>

      <main className="flex flex-col items-center gap-12">
        {/* Header Section */}
        <header className="container-box text-center flex flex-col gap-4 w-full">
          <h1
            className={`font-[var(--font-poetsen)] text-3xl sm:text-4xl pb-2 text-gradient `}
          >
            Search For Tool
          </h1>
          <p className="max-w-md mx-auto text-muted-foreground">
            Discover, explore, and use powerful online tools in one place —
            fast, simple, and free.
          </p>
          {/* Search Box */}
          <div className="flex w-full max-w-md mx-auto rounded-lg overflow-hidden border border-border shadow-sm">
            <input
              type="search"
              placeholder="Search tool..."
              className="flex-grow px-3 py-2 text-sm sm:text-base bg-card text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search for tools"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 text-sm sm:text-base font-medium hover:bg-accent transition">
              Search
            </button>
          </div>
        </header>

        {/* Popular tools with Suspense for lazy loading */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <PopularTools />
        </Suspense>

        {/* Tool Category with Suspense for lazy loading */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <ToolCategories />
        </Suspense>

        {/* Faq Section with Suspense for lazy loading */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <FaqSection />
        </Suspense>
      </main>
    </>
  );
}
