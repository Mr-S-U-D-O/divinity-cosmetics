import { Hero } from "@/components/layout/Hero";
import { Collection } from "@/components/sections/Collection";
import { Story } from "@/components/sections/Story";
import { ResellerForm } from "@/components/sections/ResellerForm";
import { FAQSection } from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <Collection />
      <Story />
      <ResellerForm />
      <FAQSection />
    </main>
  );
}
