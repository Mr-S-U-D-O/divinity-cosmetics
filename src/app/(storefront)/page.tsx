import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Collection } from "@/components/sections/Collection";
import { Story } from "@/components/sections/Story";
import { ResellerForm } from "@/components/sections/ResellerForm";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Collection />
      <Story />
      <ResellerForm />
    </main>
  );
}
