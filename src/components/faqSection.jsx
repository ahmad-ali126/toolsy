"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { faqs } from "@/data/faqs"; // adjust the path if needed
import Image from "next/image";

export function FaqSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left column - heading + description + illustration */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-8">
            Everything you need to know about Toolsy. If you have more
            questions, feel free to contact us anytime.
          </p>
          {/* <Image
            src="/window.svg"
            alt="FAQ illustration"
            width={400}
            height={300}
            className="mx-auto md:mx-0"
          /> */}
        </div>

        {/* Right column - accordion */}
        <div>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border bg-card px-4"
              >
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
