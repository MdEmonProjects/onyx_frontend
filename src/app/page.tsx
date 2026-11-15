import { Categories } from "@/components/Categories";
import { Community } from "@/components/Community";
import { Reviews } from "@/components/Reviews";
import { Hero } from "@/components/Hero";
import { Materials } from "@/components/Materials";
import { ProductGrid } from "@/components/ProductGrid";
import { Services } from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <ProductGrid />
      <Materials />
      <Reviews />
      <Community />
      <Services />
    </>
  );
}
