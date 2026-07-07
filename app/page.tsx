import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatWeDo, { Story } from "./components/WhatWeDo";
import TargetAudience, { Audience } from "./components/TargetAudience";
import Incubators, { IncubatorItem } from "./components/Incubators";
import ProductAdvantage from "./components/ProductAdvantage";
import Collaborations from "./components/Collaborations";
import LimitedEditions, { LimitedEditionItem } from "./components/LimitedEditions";
import Contact from "./components/Contact";

import { client } from "../sanity/lib/client";
import { urlFor } from "../sanity/lib/image";
import { type SanityImageSource } from "@sanity/image-url";

export const revalidate = 60;

const defaultStories: Story[] = [
  { title: ["Custom", "Installations"], storyImg: "/carousel/slide-img-1.png" },
  { title: ["Cultivated", "Furniture"], storyImg: "/carousel/slide-img-2.png" },
  { title: ["Wall", "Panels"], storyImg: "/carousel/slide-img-3.png" },
  { title: ["Design", "Luminaires"], storyImg: "/carousel/slide-img-4.png" },
  { title: ["Wall", "Panels"], storyImg: "/carousel/slide-img-5.png" },
];

const defaultAudiences: Audience[] = [
  { title: "Interior Designers", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" },
  { title: "Architects", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop" },
  { title: "Luxury Residences", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" },
  { title: "Hospitality Spaces", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" },
  { title: "Sustainable Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
];

async function getSanityData() {
  try {
    const whatWeDoData = await client.fetch(`*[_type == "whatWeDo"]`);
    const targetAudienceData = await client.fetch(`*[_type == "targetAudience"]`);
    const limitedEditionsData = await client.fetch(`*[_type == "limitedEdition"]`);
    const incubatorsData = await client.fetch(`*[_type == "incubator"]`);
    
    const stories: Story[] = whatWeDoData.map((item: { titleLine1: string; titleLine2: string; image: SanityImageSource }) => ({
      title: [item.titleLine1, item.titleLine2],
      storyImg: urlFor(item.image).url(),
    }));

    const audiences: Audience[] = targetAudienceData.map((item: { title: string; image: SanityImageSource }) => ({
      title: item.title,
      image: urlFor(item.image).url(),
    }));

    const limitedEditions: LimitedEditionItem[] = limitedEditionsData.map((item: { name: string; status: string; image: SanityImageSource }) => ({
      name: item.name,
      status: item.status,
      image: urlFor(item.image).url(),
    }));

    const incubators: IncubatorItem[] = incubatorsData.map((item: { name: string; logo: SanityImageSource }) => ({
      name: item.name,
      logo: urlFor(item.logo).url(),
    }));

    return { stories, audiences, limitedEditions, incubators };
  } catch (error) {
    console.error("Failed to fetch Sanity data:", error);
    return { stories: [], audiences: [], limitedEditions: [], incubators: [] };
  }
}

export default async function Home() {
  const { stories, audiences, limitedEditions, incubators } = await getSanityData();

  const finalStories = stories.length > 0 ? stories : defaultStories;
  const finalAudiences = audiences.length > 0 ? audiences : defaultAudiences;

  return (
    <>
      <Navbar />
      <div className="main-content-container relative bg-[#ffffff] text-[#12110E] overflow-x-hidden selection:bg-[#FF6118] selection:text-black">
        <Preloader />
        <Hero />
        <About />
        <WhatWeDo stories={finalStories} />
        <div className="bg-[#12110E]">
          <TargetAudience audiences={finalAudiences} />
          <ProductAdvantage />
          <Collaborations />
          <Incubators items={incubators} />
          <LimitedEditions items={limitedEditions} />
          <Contact />
        </div>
      </div>
    </>
  );
}