import { PopularTools } from "../components/PopularTools";
import { ToolCategories } from "../components/ToolCategory";
import { FaqSection } from "../components/faqSection";
export default function Home() {
  return (
    <main className="flex flex-col items-center gap-12">
      {" "}
      {/* Header Section */}{" "}
      <header className="container-box text-center flex flex-col gap-4 w-full">
        {" "}
        <h1 className="poetsen text-3xl sm:text-4xl font-bold pb-2 text-gradient">
          {" "}
          Search For Tool{" "}
        </h1>{" "}
        <p className="max-w-md mx-auto text-muted-foreground">
          {" "}
          Discover, explore, and use powerful online tools in one place — fast,
          simple, and free.{" "}
        </p>{" "}
        {/* Search Box */}{" "}
        <div className="flex w-full max-w-md mx-auto rounded-lg overflow-hidden border border-border shadow-sm">
          {" "}
          <input
            type="search"
            placeholder="Search tool..."
            className="flex-grow px-3 py-2 text-sm sm:text-base bg-card text-foreground placeholder:text-muted-foreground focus:outline-none"
          />{" "}
          <button className="bg-primary text-primary-foreground px-4 py-2 text-sm sm:text-base font-medium hover:bg-accent transition">
            {" "}
            Search{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      {/* Popular tools */} <PopularTools /> {/* Tool Category */}{" "}
      <ToolCategories /> {/* Faq Section */} <FaqSection />{" "}
    </main>
  );
}
